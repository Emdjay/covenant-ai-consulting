import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
if (!ADMIN_SECRET) {
  throw new Error("ADMIN_SECRET environment variable is required");
}

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return false;

  const expected = `Bearer ${ADMIN_SECRET}`;
  if (auth.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      apiKey: true,
      createdAt: true,
      _count: { select: { audits: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password } = body;

  if (
    !name || typeof name !== "string" ||
    !email || typeof email !== "string" ||
    !password || typeof password !== "string"
  ) {
    return NextResponse.json(
      { error: "name, email, and password are required (strings)" },
      { status: 400 }
    );
  }

  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Client with this email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await prisma.client.create({
    data: { name, email, password: hashedPassword },
  });

  return NextResponse.json({
    id: client.id,
    name: client.name,
    email: client.email,
    apiKey: client.apiKey,
  });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Client id required" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.analysis.deleteMany({ where: { audit: { clientId: id } } }),
    prisma.bundle.deleteMany({ where: { audit: { clientId: id } } }),
    prisma.audit.deleteMany({ where: { clientId: id } }),
    prisma.client.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
