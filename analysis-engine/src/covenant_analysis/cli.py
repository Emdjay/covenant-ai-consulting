"""CLI entry point for running workflow analysis."""

from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

from .pipeline import AnalysisPipeline
from .report import generate_markdown_report, save_json_report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="covenant-analyze",
        description="Analyze captured workflow bundles and generate reports",
    )
    parser.add_argument(
        "bundle_dir",
        type=Path,
        help="Path to the exported capture bundle directory",
    )
    parser.add_argument(
        "-o", "--output",
        type=Path,
        default=None,
        help="Output directory for reports (default: bundle_dir/reports)",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="Anthropic API key (or set ANTHROPIC_API_KEY env var)",
    )
    parser.add_argument(
        "--json-only",
        action="store_true",
        help="Only output JSON report, skip Markdown",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )

    args = parser.parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    logger = logging.getLogger("covenant-analyze")

    bundle_dir: Path = args.bundle_dir
    if not bundle_dir.is_dir():
        logger.error("Bundle directory not found: %s", bundle_dir)
        return 1

    manifest_path = bundle_dir / "manifest.json"
    if not manifest_path.exists():
        logger.error("No manifest.json found in %s", bundle_dir)
        return 1

    api_key = args.api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error(
            "Anthropic API key required. Pass --api-key or set ANTHROPIC_API_KEY env var."
        )
        return 1

    output_dir: Path = args.output or bundle_dir / "reports"
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        logger.info("Starting analysis of %s", bundle_dir)
        pipeline = AnalysisPipeline(api_key=api_key)
        analysis = pipeline.analyze_bundle(bundle_dir)

        json_path = save_json_report(analysis, output_dir / "analysis.json")
        logger.info("JSON report saved: %s", json_path)

        if not args.json_only:
            md_path = generate_markdown_report(analysis, output_dir / "report.md")
            logger.info("Markdown report saved: %s", md_path)

        logger.info("Analysis complete. %d opportunities found.", len(analysis.opportunities))
        return 0

    except Exception:
        logger.exception("Analysis failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
