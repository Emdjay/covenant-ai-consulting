from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, Field


class ActivityCategory(str, Enum):
    DATA_ENTRY = "data_entry"
    COMMUNICATION = "communication"
    RESEARCH = "research"
    CREATIVE = "creative"
    ADMIN = "admin"
    WAITING = "waiting"
    CONTEXT_SWITCH = "context_switch"
    IDLE = "idle"
    UNKNOWN = "unknown"


class ActivitySegment(BaseModel):
    start_ts: str
    end_ts: str
    category: ActivityCategory
    app_name: str
    description: str
    duration_seconds: float


class ContextSwitch(BaseModel):
    ts: str
    from_app: str
    to_app: str
    from_category: ActivityCategory
    to_category: ActivityCategory


class RepetitivePattern(BaseModel):
    description: str
    frequency: str = Field(description="e.g. '12x/day', 'hourly'")
    apps_involved: list[str]
    estimated_time_per_occurrence_seconds: float
    total_daily_time_seconds: float
    automatable: bool
    automation_approach: str | None = None


class Bottleneck(BaseModel):
    description: str
    category: str = Field(description="wait_state | approval_delay | blocked_work | tool_limitation")
    estimated_daily_cost_minutes: float
    affected_apps: list[str]


class DataFlow(BaseModel):
    description: str
    source_app: str
    destination_app: str
    frequency: str
    method: str = Field(description="copy_paste | manual_entry | export_import | email")
    automatable: bool
    automation_approach: str | None = None


class AutomationOpportunity(BaseModel):
    title: str
    description: str
    roi_score: float = Field(ge=0, le=10, description="0-10 ROI potential")
    effort_score: float = Field(ge=0, le=10, description="0-10 implementation effort")
    weekly_time_saved_hours: float
    related_patterns: list[str] = Field(default_factory=list)
    recommended_tools: list[str] = Field(default_factory=list)


class WorkflowAnalysis(BaseModel):
    session_id: str
    analyzed_at: str
    total_hours_captured: float

    activity_breakdown: list[ActivitySegment]
    context_switches: list[ContextSwitch]
    repetitive_patterns: list[RepetitivePattern]
    bottlenecks: list[Bottleneck]
    data_flows: list[DataFlow]
    opportunities: list[AutomationOpportunity]

    executive_summary: str
    time_distribution: dict[str, float] = Field(
        description="Category -> percentage of total time"
    )
