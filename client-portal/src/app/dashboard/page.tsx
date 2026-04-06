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
import { StatCard } from "@/components/stat-card";
import { mockAudits, mockAnalysis } from "@/lib/mock-data";

const statusBadge = {
  complete: { label: "Complete", icon: CheckCircle2, className: "text-success bg-success/10" },
  in_progress: { label: "In Progress", icon: Loader2, className: "text-primary bg-primary/10" },
  pending_review: { label: "Pending Review", icon: AlertTriangle, className: "text-warning bg-warning/10" },
} as const;

export default function DashboardPage() {
  const totalSavings = mockAudits.reduce((s, a) => s + a.estimated_weekly_savings_hours, 0);
  const totalOpps = mockAudits.reduce((s, a) => s + a.opportunities_found, 0);
  const totalHours = mockAudits.reduce((s, a) => s + a.total_hours, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Your workflow audit overview — Demo Corp
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
          trend={{ value: "3 new this week", positive: true }}
        />
        <StatCard
          label="Weekly Savings"
          value={`${totalSavings.toFixed(1)}h`}
          icon={TrendingUp}
          subtext="If all automated"
        />
        <StatCard
          label="Active Audits"
          value={String(mockAudits.filter((a) => a.status === "in_progress").length)}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-card-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
              <h2 className="font-semibold">Recent Audits</h2>
            </div>
            <div className="divide-y divide-card-border">
              {mockAudits.map((audit) => {
                const badge = statusBadge[audit.status];
                const BadgeIcon = badge.icon;
                return (
                  <Link
                    key={audit.id}
                    href={`/dashboard/analysis/${audit.id}`}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-background"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{audit.client_name}</p>
                        <p className="text-xs text-muted">
                          {new Date(audit.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {audit.total_hours}h captured
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                      >
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {audit.opportunities_found} opps
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Top Opportunities</h2>
            <div className="space-y-3">
              {mockAnalysis.opportunities
                .sort((a, b) => b.roi_score - a.roi_score)
                .slice(0, 3)
                .map((opp, i) => (
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
            <Link
              href="/dashboard/analysis/audit-001"
              className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View full analysis <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
