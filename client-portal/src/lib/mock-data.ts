import type { AuditSummary, WorkflowAnalysis } from "./types";

export const mockAudits: AuditSummary[] = [
  {
    id: "audit-001",
    client_name: "Demo Corp",
    status: "complete",
    created_at: "2026-03-28T09:00:00Z",
    total_hours: 38.5,
    opportunities_found: 7,
    estimated_weekly_savings_hours: 12.3,
  },
  {
    id: "audit-002",
    client_name: "Demo Corp",
    status: "in_progress",
    created_at: "2026-04-02T14:30:00Z",
    total_hours: 16.0,
    opportunities_found: 3,
    estimated_weekly_savings_hours: 5.1,
  },
];

export const mockAnalysis: WorkflowAnalysis = {
  session_id: "audit-001",
  analyzed_at: "2026-03-30T11:45:00Z",
  total_hours_captured: 38.5,
  activity_breakdown: [
    { start_ts: "2026-03-28T09:00:00Z", end_ts: "2026-03-28T09:45:00Z", category: "communication", app_name: "Outlook", description: "Email triage and responses", duration_seconds: 2700 },
    { start_ts: "2026-03-28T09:45:00Z", end_ts: "2026-03-28T10:30:00Z", category: "data_entry", app_name: "Excel", description: "Updating project tracker spreadsheet", duration_seconds: 2700 },
    { start_ts: "2026-03-28T10:30:00Z", end_ts: "2026-03-28T11:15:00Z", category: "admin", app_name: "Salesforce", description: "Updating CRM records", duration_seconds: 2700 },
    { start_ts: "2026-03-28T11:15:00Z", end_ts: "2026-03-28T11:45:00Z", category: "research", app_name: "Chrome", description: "Researching vendor pricing", duration_seconds: 1800 },
    { start_ts: "2026-03-28T11:45:00Z", end_ts: "2026-03-28T12:00:00Z", category: "waiting", app_name: "Slack", description: "Waiting for approval response", duration_seconds: 900 },
  ],
  context_switches: [
    { ts: "2026-03-28T09:12:00Z", from_app: "Outlook", to_app: "Slack", from_category: "communication", to_category: "communication" },
    { ts: "2026-03-28T09:14:00Z", from_app: "Slack", to_app: "Outlook", from_category: "communication", to_category: "communication" },
    { ts: "2026-03-28T09:45:00Z", from_app: "Outlook", to_app: "Excel", from_category: "communication", to_category: "data_entry" },
    { ts: "2026-03-28T10:05:00Z", from_app: "Excel", to_app: "Salesforce", from_category: "data_entry", to_category: "admin" },
    { ts: "2026-03-28T10:08:00Z", from_app: "Salesforce", to_app: "Excel", from_category: "admin", to_category: "data_entry" },
  ],
  repetitive_patterns: [
    {
      description: "Copy-paste data from Excel to Salesforce CRM",
      frequency: "15x/day",
      apps_involved: ["Excel", "Salesforce"],
      estimated_time_per_occurrence_seconds: 45,
      total_daily_time_seconds: 675,
      automatable: true,
      automation_approach: "Build a Salesforce-Excel API integration to sync records automatically",
    },
    {
      description: "Manually formatting report exports for stakeholders",
      frequency: "3x/day",
      apps_involved: ["Excel", "Word", "Outlook"],
      estimated_time_per_occurrence_seconds: 480,
      total_daily_time_seconds: 1440,
      automatable: true,
      automation_approach: "Create templated report generator with automated email distribution",
    },
    {
      description: "Status update messages across Slack and email",
      frequency: "8x/day",
      apps_involved: ["Slack", "Outlook"],
      estimated_time_per_occurrence_seconds: 120,
      total_daily_time_seconds: 960,
      automatable: true,
      automation_approach: "Unified status dashboard with automated notifications",
    },
  ],
  bottlenecks: [
    {
      description: "Waiting for manager approval on expense reports",
      category: "approval_delay",
      estimated_daily_cost_minutes: 35,
      affected_apps: ["Concur", "Outlook"],
    },
    {
      description: "Slow CRM search due to unindexed custom fields",
      category: "tool_limitation",
      estimated_daily_cost_minutes: 20,
      affected_apps: ["Salesforce"],
    },
  ],
  data_flows: [
    {
      description: "Project hours from timesheets to invoicing",
      source_app: "Excel",
      destination_app: "QuickBooks",
      frequency: "weekly",
      method: "manual_entry",
      automatable: true,
      automation_approach: "Direct API integration between timesheet tool and QuickBooks",
    },
    {
      description: "Lead data from website forms to CRM",
      source_app: "Chrome",
      destination_app: "Salesforce",
      frequency: "5x/day",
      method: "copy_paste",
      automatable: true,
      automation_approach: "Zapier/native webhook to auto-create CRM records",
    },
  ],
  opportunities: [
    {
      title: "Automate Excel-to-CRM Data Sync",
      description: "Eliminate the 15x/day manual copy-paste from spreadsheets to Salesforce by building a bidirectional sync API. This is the single highest-impact automation.",
      roi_score: 9.2,
      effort_score: 4.5,
      weekly_time_saved_hours: 5.6,
      related_patterns: ["Copy-paste data from Excel to Salesforce CRM"],
      recommended_tools: ["Salesforce API", "Python", "Zapier"],
    },
    {
      title: "Automated Report Generation & Distribution",
      description: "Replace manual report formatting and email distribution with a templated system that pulls data, formats, and sends automatically.",
      roi_score: 8.5,
      effort_score: 3.0,
      weekly_time_saved_hours: 4.0,
      related_patterns: ["Manually formatting report exports for stakeholders"],
      recommended_tools: ["Python", "Jinja2", "SendGrid"],
    },
    {
      title: "Unified Communication Dashboard",
      description: "Reduce context-switching between Slack and email by implementing a single-pane communication hub for status updates.",
      roi_score: 7.0,
      effort_score: 5.5,
      weekly_time_saved_hours: 2.7,
      related_patterns: ["Status update messages across Slack and email"],
      recommended_tools: ["Slack API", "Microsoft Graph API", "Custom Dashboard"],
    },
  ],
  executive_summary: `## Key Findings

This workflow analysis captured **38.5 hours** of employee activity across a 5-day work week. The data reveals significant time being spent on repetitive, manual data transfer tasks — particularly between Excel spreadsheets and Salesforce CRM.

## Automation Potential

We identified **7 automation opportunities** that could collectively save approximately **12.3 hours per week** (a 32% efficiency gain). The top opportunity — automating the Excel-to-CRM data sync — alone accounts for 5.6 hours of weekly savings.

## Recommendations

1. **Immediate wins (Week 1-2):** Implement the Excel-to-CRM sync and automated report generation. These have the highest ROI-to-effort ratios.
2. **Medium-term (Month 1):** Deploy the unified communication dashboard and automated status updates.
3. **Strategic (Quarter 1):** Address the approval workflow bottleneck with a digital approval system.`,
  time_distribution: {
    communication: 28.5,
    data_entry: 24.0,
    admin: 18.0,
    research: 12.5,
    waiting: 8.0,
    context_switch: 5.5,
    idle: 3.5,
  },
};
