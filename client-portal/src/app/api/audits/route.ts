import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const audits = await prisma.audit.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      totalHours: true,
      opportunitiesFound: true,
      estimatedWeeklySavings: true,
      client: { select: { name: true } },
    },
  });

  return NextResponse.json(
    audits.map((a) => ({
      id: a.id,
      client_name: a.client.name,
      status: a.status,
      created_at: a.createdAt.toISOString(),
      total_hours: a.totalHours,
      opportunities_found: a.opportunitiesFound,
      estimated_weekly_savings_hours: a.estimatedWeeklySavings,
    })),
  );
}
