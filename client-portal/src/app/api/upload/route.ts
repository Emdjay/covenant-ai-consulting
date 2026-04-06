import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const ANALYSIS_ENGINE_URL = process.env.ANALYSIS_ENGINE_URL || "http://analysis-engine:8100";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  const client = await prisma.client.findUnique({ where: { apiKey } });
  if (!client) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("bundle") as File | null;
  const rawSessionId = (formData.get("sessionId") as string) || "unknown";
  const sessionId = rawSessionId.replace(/[^a-zA-Z0-9_\-]/g, "_").slice(0, 100);
  const auditId = formData.get("auditId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No bundle file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".zip")) {
    return NextResponse.json({ error: "Bundle must be a .zip file" }, { status: 400 });
  }

  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Bundle too large (max 500MB)" }, { status: 413 });
  }

  const clientDir = path.join(UPLOAD_DIR, client.id);
  if (!existsSync(clientDir)) {
    await mkdir(clientDir, { recursive: true });
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${sessionId}_${ts}.zip`;
  const filePath = path.join(clientDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  let audit;
  if (auditId) {
    audit = await prisma.audit.findFirst({
      where: { id: auditId, clientId: client.id },
    });
  }

  if (!audit) {
    audit = await prisma.audit.create({
      data: {
        clientId: client.id,
        status: "in_progress",
      },
    });
  }

  const bundle = await prisma.bundle.create({
    data: {
      auditId: audit.id,
      sessionId,
      bundlePath: filePath,
      activityCount: 0,
      screenshotCount: 0,
    },
  });

  triggerAnalysis(audit.id, filePath).catch((err) =>
    console.error("Background analysis trigger failed:", err)
  );

  return NextResponse.json({
    ok: true,
    bundleId: bundle.id,
    auditId: audit.id,
    message: "Bundle uploaded. Analysis triggered.",
  });
}

async function triggerAnalysis(auditId: string, bundlePath: string) {
  try {
    const res = await fetch(`${ANALYSIS_ENGINE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bundle_path: bundlePath, audit_id: auditId }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Analysis engine error:", res.status, body);
      return;
    }

    const result = await res.json();

    await prisma.analysis.upsert({
      where: { auditId },
      create: {
        auditId,
        resultJson: result.result_json,
      },
      update: {
        resultJson: result.result_json,
      },
    });

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "complete",
        totalHours: result.total_hours || 0,
        opportunitiesFound: result.opportunities_count || 0,
        estimatedWeeklySavings: result.weekly_savings || 0,
      },
    });

    console.log(`Analysis complete for audit ${auditId}: ${result.opportunities_count} opportunities`);
  } catch (err) {
    console.error("Failed to trigger analysis engine:", err);
  }
}
