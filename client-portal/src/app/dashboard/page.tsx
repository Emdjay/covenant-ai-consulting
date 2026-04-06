export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Clock,
  Zap,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { WorkflowAnalysis } from "@/lib/types";

const statusBadge = {
  complete: { label: "Complete", icon: CheckCircle2, className: "text-success bg-success/10" },
  in_progress: { label: "In Progress", icon: Loader2, className: "text-primary bg-primary/10" },
  pending_review: { label: "Pending Review", icon: AlertTriangle, className: "text-warning bg-warning/10" },
} as const;

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    select: { name: true },
  });

  const audits = await prisma.audit.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    include: { analysis: { select: { resultJson: true } } },
  });

  const totalSavings = audits.reduce((s, a) => s + a.estimatedWeeklySavings, 0);
  const totalOpps = audits.reduce((s, a) => s + a.opportunitiesFound, 0);
  const totalHours = audits.reduce((s, a) => s + a.totalHours, 0);
  const activeCount = audits.filter((a) => a.status === "in_progress").length;

  const latestWithAnalysis = audits.find((a) => a.analysis);
  let topOpportunities: { title: string; weekly_time_saved_hours: number; roi_score: number }[] = [];
  let latestAnalysisAuditId: string | null = null;

  if (latestWithAnalysis?.analysis) {
    try {
      const parsed: WorkflowAnalysis = JSON.parse(latestWithAnalysis.analysis.resultJson);
      topOpportunities = parsed.opportunities
        .sort((a, b) => b.roi_score - a.roi_score)
        .slice(0, 3);
      latestAnalysisAuditId = latestWithAnalysis.id;
    } catch {
      // corrupted analysis data — skip
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Your workflow audit overview — {client?.name}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Hours Captured"
          value={`${totalHours.toFixed(1)}h`}
          icon={Clock}
          subtext="Across all sessions"
        />
        <StatCard
          label="Opportunities Found"
          value={String(totalOpps)}
          icon={Zap}
        />
        <StatCard
          label="Weekly Savings"
          value={`${totalSavings.toFixed(1)}h`}
          icon={TrendingUp}
          subtext="If all automated"
        />
        <StatCard
          label="Active Audits"
          value={String(activeCount)}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-card-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
              <h2 className="font-semibold">Recent Audits</h2>
            </div>
            {audits.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">
                No audits yet. Upload a capture bundle to get started.
              </div>
            ) : (
              <div className="divide-y divide-card-border">
                {audits.map((audit) => {
                  const status = audit.status as keyof typeof statusBadge;
                  const badge = statusBadge[status] ?? statusBadge.pending_review;
                  const BadgeIcon = badge.icon;
                  return (
                    <Link
                      key={audit.id}
                      href={`/dashboard/analysis/${audit.id}`}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-background"
                    >
                      <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-xs text-muted">
                          {new Date(audit.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {audit.totalHours}h captured
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                        >
                          <BadgeIcon className="h-3 w-3" />
                          {badge.label}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {audit.opportunitiesFound} opps
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Top Opportunities</h2>
            {topOpportunities.length === 0 ? (
              <p className="text-sm text-muted">
                Complete an audit to see opportunities.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {topOpportunities.map((opp, i) => (
                    <div key={opp.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{opp.title}</p>
                        <p className="text-xs text-muted">
                          {opp.weekly_time_saved_hours}h/week · ROI {opp.roi_score}/10
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {latestAnalysisAuditId && (
                  <Link
                    href={`/dashboard/analysis/${latestAnalysisAuditId}`}
                    className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View full analysis <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
