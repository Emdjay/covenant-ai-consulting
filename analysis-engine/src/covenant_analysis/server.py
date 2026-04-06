"""HTTP API for the analysis engine. Called by the client-portal after bundle upload."""

from __future__ import annotations

import asyncio
import json
import logging
import os
import tempfile
import zipfile
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .pipeline import AnalysisPipeline

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

app = FastAPI(title="Covenant Analysis Engine", version="0.1.0")

UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/app/uploads"))


class AnalyzeRequest(BaseModel):
    bundle_path: str
    audit_id: str


class AnalyzeResponse(BaseModel):
    audit_id: str
    result_json: str
    executive_summary: str
    opportunities_count: int
    total_hours: float
    weekly_savings: float


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


def _safe_extract(zf: zipfile.ZipFile, dest: Path) -> None:
    """Extract zip file with zip-slip protection."""
    dest_resolved = dest.resolve()
    for member in zf.infolist():
        member_path = (dest / member.filename).resolve()
        if not str(member_path).startswith(str(dest_resolved)):
            raise ValueError(f"Zip entry escapes target directory: {member.filename}")
        zf.extract(member, dest)


def _run_analysis(api_key: str, extract_dir: Path) -> dict:
    """Synchronous analysis — runs in a thread to avoid blocking the event loop."""
    pipeline = AnalysisPipeline(api_key=api_key)
    analysis = pipeline.analyze_bundle(extract_dir)
    return json.loads(analysis.model_dump_json())


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Analysis engine not configured")

    bundle_zip = Path(req.bundle_path)
    if not bundle_zip.exists():
        raise HTTPException(status_code=404, detail="Bundle not found")

    with tempfile.TemporaryDirectory() as tmp:
        extract_dir = Path(tmp) / "bundle"
        extract_dir.mkdir()

        if bundle_zip.suffix == ".zip":
            try:
                with zipfile.ZipFile(bundle_zip, "r") as zf:
                    _safe_extract(zf, extract_dir)
            except (zipfile.BadZipFile, ValueError) as exc:
                raise HTTPException(status_code=400, detail="Invalid or unsafe zip file") from exc
            contents = list(extract_dir.iterdir())
            if len(contents) == 1 and contents[0].is_dir():
                extract_dir = contents[0]
        else:
            raise HTTPException(status_code=400, detail="Bundle must be a .zip file")

        manifest_path = extract_dir / "manifest.json"
        if not manifest_path.exists():
            raise HTTPException(status_code=400, detail="No manifest.json in bundle")

        logger.info("Starting analysis for audit %s", req.audit_id)
        result_data = await asyncio.to_thread(_run_analysis, api_key, extract_dir)

        weekly_savings = sum(
            opp.get("weekly_time_saved_hours", 0) for opp in result_data.get("opportunities", [])
        )

        logger.info(
            "Analysis complete for audit %s: %d opportunities, %.1f hrs/wk savings",
            req.audit_id, len(result_data.get("opportunities", [])), weekly_savings,
        )

        return AnalyzeResponse(
            audit_id=req.audit_id,
            result_json=json.dumps(result_data),
            executive_summary=result_data.get("executive_summary", ""),
            opportunities_count=len(result_data.get("opportunities", [])),
            total_hours=result_data.get("total_hours_captured", 0),
            weekly_savings=weekly_savings,
        )
