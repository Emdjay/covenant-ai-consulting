# Analysis Engine

Python pipeline that processes raw screen captures and activity logs into
structured workflow insights using Claude API.

## Stack

- Python 3.12
- Anthropic Claude API (vision + text)
- Structured JSON output schemas

## Pipeline Stages

1. **OCR Pass** — Extract text from screen captures (Claude vision)
2. **Activity Classification** — Categorize segments (data entry, communication, research, creative, idle)
3. **Pattern Detection** — Find repetitive sequences across days
4. **Context-Switch Mapping** — Track app-switching frequency and patterns
5. **Bottleneck Identification** — Detect wait states, approval delays, blocked work
6. **Data-Flow Tracing** — Identify manual data movement between systems
7. **Opportunity Scoring** — Rank automation candidates by ROI potential

## Output

- Structured workflow map (JSON)
- Time heatmap data
- Scored opportunity matrix
- Executive summary (markdown → PDF)
