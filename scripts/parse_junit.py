#!/usr/bin/env python3
"""
Suite-aware JUnit parser.

Each invocation handles a single test suite (e.g. mobile, api). The aggregator
script then merges the per-suite outputs into a single payload for the UI.

Usage:
    python scripts/parse_junit.py \
        --suite-id mobile \
        --suite-name "Mobile · Appium" \
        --suite-repo user/tohkn-testing-suite \
        --junit-dir /tmp/mobile/junit \
        --screenshots-dir /tmp/mobile/screenshots \
        --screenshots-prefix screenshots/mobile \
        --run-id 1234567 \
        --commit $SHA \
        --branch main \
        --run-url https://github.com/.../actions/runs/1234567 \
        --out public/data/suites/mobile.json
"""
import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


TAG_RE = re.compile(r"@[\w:_-]+")


def _extract_tags(system_out_text: str) -> list[str]:
    if not system_out_text:
        return []
    header = system_out_text.split("Scenario:")[0]
    return sorted(set(TAG_RE.findall(header)))


def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def _failure_message(testcase: ET.Element) -> str | None:
    fail = testcase.find("failure") or testcase.find("error")
    if fail is None:
        return None
    msg = fail.get("message") or ""
    body = (fail.text or "").strip()
    return (msg + "\n" + body).strip() or None


def _find_screenshot(
    screenshots_dir: Path, scenario_name: str, prefix: str
) -> str | None:
    if not screenshots_dir.exists():
        return None
    needle = scenario_name.replace(" ", "_")
    candidates = sorted(
        screenshots_dir.glob(f"FAIL_{needle}_*.png"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not candidates:
        return None
    return f"{prefix}/{candidates[0].name}"


def parse_junit(
    junit_dir: Path, screenshots_dir: Path, screenshots_prefix: str
) -> dict:
    features: list[dict] = []
    tag_counts: dict[str, dict] = defaultdict(
        lambda: {"passed": 0, "failed": 0, "skipped": 0}
    )
    screenshots: list[dict] = []
    totals = {"total": 0, "passed": 0, "failed": 0, "skipped": 0, "duration": 0.0}

    for xml_path in sorted(junit_dir.glob("TESTS-*.xml")):
        try:
            tree = ET.parse(xml_path)
        except ET.ParseError as exc:
            print(f"[parse_junit] skipping {xml_path}: {exc}", file=sys.stderr)
            continue

        root = tree.getroot()
        feature_name = root.get("name", xml_path.stem).split(".", 1)[-1]
        feature_duration = float(root.get("time", "0") or 0)

        feature = {
            "name": feature_name,
            "slug": _slug(feature_name),
            "tests": int(root.get("tests", "0") or 0),
            "failed": int(root.get("failures", "0") or 0)
            + int(root.get("errors", "0") or 0),
            "skipped": int(root.get("skipped", "0") or 0),
            "duration": feature_duration,
            "tags": set(),
            "scenarios": [],
        }
        feature["passed"] = feature["tests"] - feature["failed"] - feature["skipped"]

        for tc in root.findall("testcase"):
            status = tc.get("status") or (
                "failed"
                if tc.find("failure") is not None or tc.find("error") is not None
                else "skipped"
                if tc.find("skipped") is not None
                else "passed"
            )
            sys_out = tc.find("system-out")
            sys_out_text = (sys_out.text or "") if sys_out is not None else ""
            tags = _extract_tags(sys_out_text)
            scenario_name = tc.get("name", "")

            scenario = {
                "name": scenario_name,
                "status": status,
                "duration": float(tc.get("time", "0") or 0),
                "tags": tags,
                "failureMessage": _failure_message(tc),
                "screenshot": None,
            }

            if status == "failed":
                shot = _find_screenshot(screenshots_dir, scenario_name, screenshots_prefix)
                if shot:
                    scenario["screenshot"] = shot
                    screenshots.append(
                        {
                            "scenario": scenario_name,
                            "feature": feature_name,
                            "path": shot,
                            "tags": tags,
                        }
                    )

            bucket = status if status in ("passed", "failed", "skipped") else "failed"
            for t in tags:
                tag_counts[t][bucket] += 1
                feature["tags"].add(t)

            feature["scenarios"].append(scenario)

        feature["tags"] = sorted(feature["tags"])
        features.append(feature)

        totals["total"] += feature["tests"]
        totals["passed"] += feature["passed"]
        totals["failed"] += feature["failed"]
        totals["skipped"] += feature["skipped"]
        totals["duration"] += feature["duration"]

    pass_rate = (totals["passed"] / totals["total"]) if totals["total"] else 0.0

    return {
        "summary": {**totals, "passRate": round(pass_rate, 4)},
        "features": features,
        "tags": [{"tag": t, **counts} for t, counts in sorted(tag_counts.items())],
        "screenshots": screenshots,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--suite-id", required=True)
    p.add_argument("--suite-name", required=True)
    p.add_argument("--suite-repo", default="")
    p.add_argument("--junit-dir", default="reports/junit")
    p.add_argument("--screenshots-dir", default="reports/screenshots")
    p.add_argument(
        "--screenshots-prefix",
        default="",
        help="Path prefix (without /data/) the UI uses to resolve screenshots. "
        "Defaults to 'screenshots/<suite-id>'.",
    )
    p.add_argument("--out", required=True)
    p.add_argument("--run-id", default="local")
    p.add_argument("--commit", default="")
    p.add_argument("--branch", default="")
    p.add_argument("--run-url", default="")
    args = p.parse_args()

    prefix = args.screenshots_prefix or f"screenshots/{args.suite_id}"
    parsed = parse_junit(
        Path(args.junit_dir), Path(args.screenshots_dir), prefix
    )

    suite = {
        "id": args.suite_id,
        "name": args.suite_name,
        "repo": args.suite_repo,
        "runId": args.run_id,
        "commit": args.commit,
        "commitShort": args.commit[:7] if args.commit else "",
        "branch": args.branch,
        "runUrl": args.run_url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **parsed,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(suite, indent=2))
    print(
        f"[parse_junit] suite={args.suite_id} → {out_path} "
        f"(tests={suite['summary']['total']}, "
        f"passed={suite['summary']['passed']}, "
        f"failed={suite['summary']['failed']})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
