import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.JWT_SECRET || "admin-secret";

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${ADMIN_SECRET}`) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
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

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email, and password are required" },
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

  await prisma.analysis.deleteMany({ where: { audit: { clientId: id } } });
  await prisma.bundle.deleteMany({ where: { audit: { clientId: id } } });
  await prisma.audit.deleteMany({ where: { clientId: id } });
  await prisma.client.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
