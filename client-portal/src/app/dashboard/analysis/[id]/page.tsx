import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TimeChart } from "@/components/time-chart";
import { OpportunityCard } from "@/components/opportunity-card";
import type { WorkflowAnalysis } from "@/lib/types";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const audit = await prisma.audit.findFirst({
    where: { id, clientId: session.clientId },
    include: { analysis: true },
  });

  if (!audit) notFound();

  if (!audit.analysis) {
    return (
      <div>
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border bg-card transition-colors hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Workflow Analysis</h1>
            <p className="text-sm text-muted">Audit {id}</p>
          </div>
        </div>
        <div className="rounded-xl border border-card-border bg-card p-8 text-center">
          <p className="text-lg font-medium">Analysis in Progress</p>
          <p className="mt-2 text-sm text-muted">
            This audit is still being analyzed. Check back shortly.
          </p>
        </div>
      </div>
    );
  }

  const analysis: WorkflowAnalysis = JSON.parse(audit.analysis.resultJson);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border bg-card transition-colors hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Workflow Analysis</h1>
            <p className="text-sm text-muted">
              Session {analysis.session_id} ·{" "}
              {new Date(analysis.analyzed_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-card-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Executive Summary</h2>
        <div className="prose prose-sm max-w-none text-muted [&_h2]:text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_strong]:text-foreground [&_li]:my-0.5">
          {analysis.executive_summary.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="mt-4 first:mt-0">
                  {line.slice(3)}
                </h2>
              );
            }
            if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
              const parts = line.match(/^\d+\.\s\*\*(.*?)\*\*\s(.*)$/);
              if (parts) {
                return (
                  <p key={i} className="ml-4">
                    <strong>{parts[1]}</strong> {parts[2]}
                  </p>
                );
              }
            }
            if (line.trim() === "") return null;
            return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
          })}
        </div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <TimeChart distribution={analysis.time_distribution} />

        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Bottlenecks
          </h3>
          <div className="space-y-4">
            {analysis.bottlenecks.map((b) => (
              <div key={b.description} className="rounded-lg border border-card-border p-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{b.description}</p>
                  <span className="shrink-0 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                    {b.estimated_daily_cost_minutes} min/day
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Type: {b.category.replace(/_/g, " ")} · Apps:{" "}
                  {b.affected_apps.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-card-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Repetitive Patterns
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4 font-medium">Pattern</th>
                <th className="pb-3 pr-4 font-medium">Frequency</th>
                <th className="pb-3 pr-4 font-medium">Daily Cost</th>
                <th className="pb-3 pr-4 font-medium">Automatable</th>
                <th className="pb-3 font-medium">Approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {analysis.repetitive_patterns.map((p) => (
                <tr key={p.description}>
                  <td className="py-3 pr-4 font-medium">{p.description}</td>
                  <td className="py-3 pr-4 text-muted">{p.frequency}</td>
                  <td className="py-3 pr-4 text-muted">
                    {Math.round(p.total_daily_time_seconds / 60)} min
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.automatable
                          ? "bg-success/10 text-success"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      {p.automatable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-muted">
                    {p.automation_approach ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-card-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Data Flows
        </h3>
        <div className="space-y-3">
          {analysis.data_flows.map((df) => (
            <div
              key={df.description}
              className="flex items-center justify-between rounded-lg border border-card-border p-4"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {df.source_app}
                </span>
                <span className="text-muted">→</span>
                <span className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {df.destination_app}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted">
                  {df.method.replace(/_/g, " ")} · {df.frequency}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    df.automatable
                      ? "bg-success/10 text-success"
                      : "bg-muted/10 text-muted"
                  }`}
                >
                  {df.automatable ? "Automatable" : "Manual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold">
          Automation Opportunities
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {analysis.opportunities
            .sort((a, b) => b.roi_score - a.roi_score)
            .map((opp, i) => (
              <OpportunityCard key={opp.title} opportunity={opp} rank={i + 1} />
            ))}
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Context Switching
        </h3>
        <p className="mb-3 text-sm text-muted">
          {analysis.context_switches.length} context switches recorded during
          this session.
        </p>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const pairs: Record<string, number> = {};
            analysis.context_switches.forEach((cs) => {
              const k = `${cs.from_app} → ${cs.to_app}`;
              pairs[k] = (pairs[k] || 0) + 1;
            });
            return Object.entries(pairs)
              .sort(([, a], [, b]) => b - a)
              .map(([pair, count]) => (
                <span
                  key={pair}
                  className="rounded-full border border-card-border px-3 py-1.5 text-xs font-medium"
                >
                  {pair}{" "}
                  <span className="text-muted">×{count}</span>
                </span>
              ));
          })()}
        </div>
      </div>
    </div>
  );
}
