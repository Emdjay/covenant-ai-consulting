import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

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
  const sessionId = (formData.get("sessionId") as string) || "unknown";
  const auditId = formData.get("auditId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No bundle file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".zip")) {
    return NextResponse.json({ error: "Bundle must be a .zip file" }, { status: 400 });
  }

  const maxSize = 500 * 1024 * 1024; // 500MB
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

  return NextResponse.json({
    ok: true,
    bundleId: bundle.id,
    auditId: audit.id,
    message: "Bundle uploaded successfully. Analysis will be triggered.",
  });
}
