import type { AutomationOpportunity } from "@/lib/types";
import { Zap, Clock, Wrench } from "lucide-react";

interface OpportunityCardProps {
  opportunity: AutomationOpportunity;
  rank: number;
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const roiColor =
    opportunity.roi_score >= 8
      ? "text-success"
      : opportunity.roi_score >= 5
      ? "text-warning"
      : "text-muted";

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {rank}
          </span>
          <h4 className="font-semibold">{opportunity.title}</h4>
        </div>
        <span className={`text-lg font-bold ${roiColor}`}>
          {opportunity.roi_score}/10
        </span>
      </div>

      <p className="mb-4 text-sm text-muted">{opportunity.description}</p>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            {opportunity.weekly_time_saved_hours}h/week saved
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-warning" />
          <span>Effort: {opportunity.effort_score}/10</span>
        </div>
      </div>

      {opportunity.recommended_tools.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <Wrench className="h-3.5 w-3.5" />
          {opportunity.recommended_tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-background px-2 py-0.5 font-medium"
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
