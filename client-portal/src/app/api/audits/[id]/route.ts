import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const audit = await prisma.audit.findFirst({
    where: { id, clientId: session.clientId },
    include: { analysis: true },
  });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  if (!audit.analysis) {
    return NextResponse.json({ error: "Analysis not yet available" }, { status: 404 });
  }

  try {
    const analysis = JSON.parse(audit.analysis.resultJson);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json({ error: "Analysis data corrupted" }, { status: 500 });
  }
}
