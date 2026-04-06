export type ActivityCategory =
  | "data_entry"
  | "communication"
  | "research"
  | "creative"
  | "admin"
  | "waiting"
  | "context_switch"
  | "idle"
  | "unknown";

export interface ActivitySegment {
  start_ts: string;
  end_ts: string;
  category: ActivityCategory;
  app_name: string;
  description: string;
  duration_seconds: number;
}

export interface ContextSwitch {
  ts: string;
  from_app: string;
  to_app: string;
  from_category: ActivityCategory;
  to_category: ActivityCategory;
}

export interface RepetitivePattern {
  description: string;
  frequency: string;
  apps_involved: string[];
  estimated_time_per_occurrence_seconds: number;
  total_daily_time_seconds: number;
  automatable: boolean;
  automation_approach: string | null;
}

export interface Bottleneck {
  description: string;
  category: string;
  estimated_daily_cost_minutes: number;
  affected_apps: string[];
}

export interface DataFlow {
  description: string;
  source_app: string;
  destination_app: string;
  frequency: string;
  method: string;
  automatable: boolean;
  automation_approach: string | null;
}

export interface AutomationOpportunity {
  title: string;
  description: string;
  roi_score: number;
  effort_score: number;
  weekly_time_saved_hours: number;
  related_patterns: string[];
  recommended_tools: string[];
}

export interface WorkflowAnalysis {
  session_id: string;
  analyzed_at: string;
  total_hours_captured: number;
  activity_breakdown: ActivitySegment[];
  context_switches: ContextSwitch[];
  repetitive_patterns: RepetitivePattern[];
  bottlenecks: Bottleneck[];
  data_flows: DataFlow[];
  opportunities: AutomationOpportunity[];
  executive_summary: string;
  time_distribution: Record<string, number>;
}

export interface AuditSummary {
  id: string;
  client_name: string;
  status: "in_progress" | "complete" | "pending_review";
  created_at: string;
  total_hours: number;
  opportunities_found: number;
  estimated_weekly_savings_hours: number;
}
