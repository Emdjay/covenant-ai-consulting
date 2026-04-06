import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { mockAnalysis } from "@/lib/mock-data";

export async function POST() {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED) {
    return NextResponse.json({ error: "Seed disabled in production" }, { status: 403 });
  }

  const existing = await prisma.client.findUnique({
    where: { email: "demo@democorp.com" },
  });
  if (existing) {
    return NextResponse.json({ message: "Already seeded", apiKey: existing.apiKey });
  }

  const password = await bcrypt.hash("demo123", 10);
  const client = await prisma.client.create({
    data: {
      name: "Demo Corp",
      email: "demo@democorp.com",
      password,
    },
  });

  const audit1 = await prisma.audit.create({
    data: {
      clientId: client.id,
      status: "complete",
      totalHours: 38.5,
      opportunitiesFound: 7,
      estimatedWeeklySavings: 12.3,
    },
  });

  await prisma.analysis.create({
    data: {
      auditId: audit1.id,
      resultJson: JSON.stringify(mockAnalysis),
    },
  });

  await prisma.audit.create({
    data: {
      clientId: client.id,
      status: "in_progress",
      totalHours: 16.0,
      opportunitiesFound: 3,
      estimatedWeeklySavings: 5.1,
    },
  });

  return NextResponse.json({
    message: "Seeded successfully",
    email: "demo@democorp.com",
    apiKey: client.apiKey,
  });
}
