from __future__ import annotations

import base64
import json
import logging
from datetime import datetime
from pathlib import Path

import anthropic

from .models import WorkflowAnalysis

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert workflow analyst for Covenant AI Consulting. 
You analyze employee activity data (window focus logs, screenshots, clipboard events, 
idle periods) to identify automation opportunities.

Your analysis must be:
- Specific and actionable (not vague observations)
- Quantified with time estimates
- Prioritized by ROI (time saved vs implementation effort)
- Respectful of employee privacy (focus on process, not performance)

Output valid JSON matching the provided schema."""


class AnalysisPipeline:
    def __init__(self, api_key: str | None = None):
        self.client = anthropic.Anthropic(api_key=api_key)

    def analyze_bundle(self, bundle_dir: str | Path) -> WorkflowAnalysis:
        bundle_dir = Path(bundle_dir)
        manifest = json.loads((bundle_dir / "manifest.json").read_text())
        activities = json.loads((bundle_dir / "activities.json").read_text())
        screenshots_manifest = json.loads((bundle_dir / "screenshots.json").read_text())

        logger.info(
            "Analyzing bundle: %s (%d activities, %d screenshots)",
            manifest.get("sessionId", "unknown"),
            len(activities),
            len(screenshots_manifest),
        )

        screenshot_analyses = self._analyze_screenshots(bundle_dir, screenshots_manifest)
        analysis = self._run_full_analysis(manifest, activities, screenshot_analyses)
        return analysis

    def _analyze_screenshots(
        self, bundle_dir: Path, screenshots: list[dict]
    ) -> list[dict]:
        results = []
        sample = screenshots[::max(1, len(screenshots) // 20)]  # sample ~20

        for ss in sample:
            file_path = bundle_dir / "screenshots" / ss["file"]
            if not file_path.exists():
                continue

            image_data = base64.standard_b64encode(file_path.read_bytes()).decode()
            ext = file_path.suffix.lstrip(".")
            media_type = "image/jpeg" if ext in ("jpg", "jpeg") else f"image/{ext}"

            try:
                response = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=500,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": media_type,
                                        "data": image_data,
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": (
                                        "Describe what the user is doing in this screenshot. "
                                        "Identify: the application, the task category "
                                        "(data_entry, communication, research, creative, admin, waiting), "
                                        "and any visible text that indicates the workflow step. "
                                        "Be concise — 2-3 sentences max."
                                    ),
                                },
                            ],
                        }
                    ],
                )
                results.append({
                    "ts": ss["ts"],
                    "analysis": response.content[0].text,
                })
            except Exception as e:
                logger.warning("Screenshot analysis failed for %s: %s", ss["file"], e)

        return results

    def _run_full_analysis(
        self,
        manifest: dict,
        activities: list[dict],
        screenshot_analyses: list[dict],
    ) -> WorkflowAnalysis:
        activity_summary = self._summarize_activities(activities)
        screenshot_summary = "\n".join(
            f"[{s['ts']}] {s['analysis']}" for s in screenshot_analyses
        )

        prompt = f"""Analyze this workflow capture data and produce a complete workflow analysis.

## Capture Session
- Session ID: {manifest.get('sessionId', 'unknown')}
- Activities captured: {manifest.get('activityCount', 0)}
- Screenshots analyzed: {len(screenshot_analyses)}

## Activity Log Summary
{activity_summary}

## Screenshot Analysis
{screenshot_summary}

## Required Output
Produce a JSON object with this exact structure:
- session_id: string
- analyzed_at: ISO timestamp
- total_hours_captured: number
- activity_breakdown: array of segments with start_ts, end_ts, category, app_name, description, duration_seconds
- context_switches: array with ts, from_app, to_app, from_category, to_category
- repetitive_patterns: array with description, frequency, apps_involved, estimated_time_per_occurrence_seconds, total_daily_time_seconds, automatable, automation_approach
- bottlenecks: array with description, category, estimated_daily_cost_minutes, affected_apps
- data_flows: array with description, source_app, destination_app, frequency, method, automatable, automation_approach
- opportunities: array with title, description, roi_score (0-10), effort_score (0-10), weekly_time_saved_hours, related_patterns, recommended_tools
- executive_summary: 3-5 paragraph markdown summary
- time_distribution: object mapping category names to percentage of total time

Focus on actionable automation opportunities with clear ROI estimates."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )

        raw_text = response.content[0].text
        json_start = raw_text.find("{")
        json_end = raw_text.rfind("}") + 1
        if json_start == -1 or json_end == 0:
            raise ValueError("No JSON found in Claude response")

        data = json.loads(raw_text[json_start:json_end])
        data["session_id"] = manifest.get("sessionId", "unknown")
        data["analyzed_at"] = datetime.now().isoformat()

        return WorkflowAnalysis.model_validate(data)

    def _summarize_activities(self, activities: list[dict]) -> str:
        if not activities:
            return "No activities recorded."

        app_counts: dict[str, int] = {}
        event_counts: dict[str, int] = {}
        for a in activities:
            app = a.get("app_name", "unknown") or "unknown"
            event = a.get("event_type", "unknown") or "unknown"
            app_counts[app] = app_counts.get(app, 0) + 1
            event_counts[event] = event_counts.get(event, 0) + 1

        lines = ["### App Usage (by event count)"]
        for app, count in sorted(app_counts.items(), key=lambda x: -x[1])[:15]:
            lines.append(f"- {app}: {count} events")

        lines.append("\n### Event Types")
        for event, count in sorted(event_counts.items(), key=lambda x: -x[1]):
            lines.append(f"- {event}: {count}")

        lines.append(f"\n### Timeline")
        lines.append(f"- First event: {activities[0].get('ts', 'N/A')}")
        lines.append(f"- Last event: {activities[-1].get('ts', 'N/A')}")
        lines.append(f"- Total events: {len(activities)}")

        window_titles = [
            a.get("window_title", "")
            for a in activities
            if a.get("window_title")
        ]
        if window_titles:
            lines.append("\n### Sample Window Titles (first 20)")
            for title in window_titles[:20]:
                lines.append(f"- {title[:100]}")

        return "\n".join(lines)
