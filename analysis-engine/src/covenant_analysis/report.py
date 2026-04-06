from __future__ import annotations

import json
from pathlib import Path

from .models import WorkflowAnalysis


def generate_markdown_report(analysis: WorkflowAnalysis, output_path: str | Path) -> Path:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    md = [f"# Workflow Analysis Report — {analysis.session_id}\n"]
    md.append(f"*Generated: {analysis.analyzed_at}*\n")
    md.append(f"*Total captured: {analysis.total_hours_captured:.1f} hours*\n")

    md.append("---\n")
    md.append("## Executive Summary\n")
    md.append(analysis.executive_summary + "\n")

    md.append("---\n")
    md.append("## Time Distribution\n")
    md.append("| Category | % of Time |")
    md.append("|----------|-----------|")
    for cat, pct in sorted(analysis.time_distribution.items(), key=lambda x: -x[1]):
        md.append(f"| {cat.replace('_', ' ').title()} | {pct:.1f}% |")
    md.append("")

    if analysis.repetitive_patterns:
        md.append("---\n")
        md.append("## Repetitive Patterns\n")
        for i, p in enumerate(analysis.repetitive_patterns, 1):
            auto = "Yes" if p.automatable else "No"
            md.append(f"### {i}. {p.description}\n")
            md.append(f"- **Frequency:** {p.frequency}")
            md.append(f"- **Apps involved:** {', '.join(p.apps_involved)}")
            md.append(f"- **Time per occurrence:** {p.estimated_time_per_occurrence_seconds:.0f}s")
            md.append(f"- **Daily total:** {p.total_daily_time_seconds / 60:.1f} min")
            md.append(f"- **Automatable:** {auto}")
            if p.automation_approach:
                md.append(f"- **Approach:** {p.automation_approach}")
            md.append("")

    if analysis.bottlenecks:
        md.append("---\n")
        md.append("## Bottlenecks\n")
        for b in analysis.bottlenecks:
            md.append(f"### {b.description}\n")
            md.append(f"- **Type:** {b.category.replace('_', ' ').title()}")
            md.append(f"- **Daily cost:** {b.estimated_daily_cost_minutes:.0f} min")
            md.append(f"- **Affected apps:** {', '.join(b.affected_apps)}")
            md.append("")

    if analysis.data_flows:
        md.append("---\n")
        md.append("## Data Flows\n")
        md.append("| Flow | Source → Dest | Method | Automatable |")
        md.append("|------|--------------|--------|-------------|")
        for df in analysis.data_flows:
            auto = "Yes" if df.automatable else "No"
            md.append(
                f"| {df.description} | {df.source_app} → {df.destination_app} "
                f"| {df.method.replace('_', ' ')} | {auto} |"
            )
        md.append("")

    if analysis.opportunities:
        md.append("---\n")
        md.append("## Automation Opportunities\n")
        sorted_opps = sorted(analysis.opportunities, key=lambda o: -o.roi_score)
        for i, opp in enumerate(sorted_opps, 1):
            md.append(f"### {i}. {opp.title}\n")
            md.append(f"**ROI Score: {opp.roi_score}/10 | Effort: {opp.effort_score}/10 | "
                       f"Weekly Savings: {opp.weekly_time_saved_hours:.1f}h**\n")
            md.append(opp.description + "\n")
            if opp.recommended_tools:
                md.append(f"- **Recommended tools:** {', '.join(opp.recommended_tools)}")
            md.append("")

    if analysis.context_switches:
        md.append("---\n")
        md.append("## Context Switching Summary\n")
        md.append(f"Total context switches: {len(analysis.context_switches)}\n")
        pair_counts: dict[str, int] = {}
        for cs in analysis.context_switches:
            pair = f"{cs.from_app} → {cs.to_app}"
            pair_counts[pair] = pair_counts.get(pair, 0) + 1
        md.append("| Switch Pattern | Count |")
        md.append("|---------------|-------|")
        for pair, count in sorted(pair_counts.items(), key=lambda x: -x[1])[:10]:
            md.append(f"| {pair} | {count} |")
        md.append("")

    report_text = "\n".join(md)
    output_path.write_text(report_text)

    return output_path


def save_json_report(analysis: WorkflowAnalysis, output_path: str | Path) -> Path:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(analysis.model_dump_json(indent=2))
    return output_path
