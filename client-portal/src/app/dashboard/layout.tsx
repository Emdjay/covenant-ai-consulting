import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    select: { name: true },
  });

  const audits = await prisma.audit.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    take: 1,
    select: { id: true },
  });

  const latestAuditId = audits[0]?.id;

  return (
    <div className="flex min-h-screen">
      <Sidebar clientName={client?.name ?? "Client"} latestAuditId={latestAuditId} />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
