#!/usr/bin/env python3
"""
Combine per-suite JSON payloads (produced by parse_junit.py) into a single
runs.json that the dashboard home page consumes.

Also appends a row to history.json for trend charts.

Usage:
    python scripts/aggregate.py \
        --suites public/data/suites/mobile.json public/data/suites/api.json \
        --out public/data/runs.json \
        --history public/data/history.json \
        --history-limit 60
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def _empty_summary() -> dict:
    return {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "skipped": 0,
        "duration": 0.0,
        "passRate": 0.0,
    }


def aggregate(suite_paths: list[Path]) -> dict:
    suites: list[dict] = []
    for sp in suite_paths:
        if not sp.exists():
            print(f"[aggregate] missing {sp}, skipping", file=sys.stderr)
            continue
        suites.append(json.loads(sp.read_text()))

    agg = _empty_summary()
    for s in suites:
        ss = s.get("summary", {})
        agg["total"] += ss.get("total", 0)
        agg["passed"] += ss.get("passed", 0)
        agg["failed"] += ss.get("failed", 0)
        agg["skipped"] += ss.get("skipped", 0)
        agg["duration"] += ss.get("duration", 0.0)
    agg["passRate"] = round((agg["passed"] / agg["total"]) if agg["total"] else 0.0, 4)

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "aggregate": agg,
        "suites": suites,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--suites", nargs="+", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--history", required=True)
    p.add_argument("--history-limit", type=int, default=60)
    args = p.parse_args()

    runs = aggregate([Path(s) for s in args.suites])

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(runs, indent=2))
    print(
        f"[aggregate] wrote {out_path} "
        f"(suites={len(runs['suites'])}, total={runs['aggregate']['total']})"
    )

    history_path = Path(args.history)
    history_path.parent.mkdir(parents=True, exist_ok=True)
    if history_path.exists():
        try:
            history = json.loads(history_path.read_text())
        except json.JSONDecodeError:
            history = []
    else:
        history = []

    history.append(
        {
            "timestamp": runs["generatedAt"],
            "aggregate": runs["aggregate"],
            "suites": [
                {
                    "id": s["id"],
                    "name": s["name"],
                    "summary": s.get("summary", _empty_summary()),
                    "commit": s.get("commitShort", ""),
                    "branch": s.get("branch", ""),
                    "features": [
                        {
                            "name": f["name"],
                            "status": (
                                "failed"
                                if f.get("failed", 0) > 0
                                else "skipped"
                                if f.get("skipped", 0) > 0 and f.get("passed", 0) == 0
                                else "passed"
                            ),
                            "tests": f.get("tests", 0),
                            "passed": f.get("passed", 0),
                            "failed": f.get("failed", 0),
                            "skipped": f.get("skipped", 0),
                            "duration": f.get("duration", 0.0),
                        }
                        for f in s.get("features", [])
                    ],
                }
                for s in runs["suites"]
            ],
        }
    )
    history = history[-args.history_limit :]
    history_path.write_text(json.dumps(history, indent=2))
    print(f"[aggregate] appended to {history_path} ({len(history)} entries)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
