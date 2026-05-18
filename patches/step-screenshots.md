# Patch — per-step screenshots

By default, both test repos only capture a screenshot when an entire
**scenario** fails (`after_scenario` hook in `features/environment.py`).
To get a screenshot **per step** the dashboard already knows how to render,
apply this patch to each test repo's `features/environment.py`.

## What the dashboard expects

For every step that a hook wants to attach a screenshot to, save the PNG with
this exact name pattern:

```
STEP_<scenario_name>_<step_index>_<status>.png
```

- `<scenario_name>` — the scenario name with spaces replaced by underscores.
- `<step_index>` — zero-padded 2-digit index in the scenario (`00`, `01`, …).
- `<status>` — `passed`, `failed`, or `skipped`.

The existing failure file (`FAIL_<scenario>_<ts>.png`) keeps working as the
scenario-level screenshot. The new `STEP_…` files are matched by the parser
and attached to the right step row.

## Patch for `mio3-io/tohkn-testing-suite`

Edit `features/environment.py` and replace the existing `after_step` no-op
with:

```python
import os
import re


_STEP_INDEX = "_qa_pulse_step_idx"


def _slug_scenario(name: str) -> str:
    return re.sub(r"\s+", "_", name.strip())


def before_scenario(context, scenario):
    # ... existing setup ...
    setattr(context, _STEP_INDEX, 0)


def after_step(context, step):
    # Existing QA-agent hook integration stays here.
    qa_agent_hooks.on_after_step(context, step)

    # New: capture a screenshot per step.
    try:
        idx = getattr(context, _STEP_INDEX, 0)
        setattr(context, _STEP_INDEX, idx + 1)

        status = (step.status.name if hasattr(step.status, "name")
                  else str(step.status)).lower()
        if status not in ("passed", "failed", "skipped"):
            status = "skipped"

        # Skip noise: only capture for failed steps + the first/last passed step
        # of each scenario. Tune as you like — see "Tuning" below.
        if status != "failed" and idx not in (0,):
            return

        if not hasattr(context, "driver") or context.driver is None:
            return

        screenshots_dir = os.path.join(os.getcwd(), "reports", "screenshots")
        os.makedirs(screenshots_dir, exist_ok=True)
        scenario_slug = _slug_scenario(context.scenario.name)
        filename = f"STEP_{scenario_slug}_{idx:02d}_{status}.png"
        path = os.path.join(screenshots_dir, filename)
        context.driver.save_screenshot(path)
        logger.info("📸 step screenshot saved: %s", filename)
    except Exception as exc:
        logger.warning("⚠️ failed to capture step screenshot: %s", exc)
```

## Patch for `mio3-io/api-automation`

The Sumsub flow already captures a screenshot per stage inside
`utils/sumsub_flow.py::_screenshot()`. To make those visible per-step
through the dashboard:

1. Rename the output to follow the `STEP_<scenario>_<idx>_<status>.png`
   convention. Easiest path: in `features/environment.py`, wrap
   `after_step` and rename the latest `reports/sumsub_flow_*/...png` to
   the predictable name.
2. Ensure the file lands in `reports/screenshots/` (which is what the
   `failure-screenshots` artifact uploads).

Reference snippet (`features/environment.py`):

```python
def after_step(context, step):
    # existing behavior...
    if step.status.name.lower() == "failed":
        idx = getattr(context, "_qa_pulse_step_idx", 0)
        scenario_slug = re.sub(r"\s+", "_", context.scenario.name.strip())
        target = (Path("reports/screenshots") /
                  f"STEP_{scenario_slug}_{idx:02d}_failed.png")
        target.parent.mkdir(parents=True, exist_ok=True)
        # Grab the latest sumsub flow screenshot, if any.
        latest = max(Path("reports").glob("sumsub_flow_*/**/*.png"),
                     default=None, key=lambda p: p.stat().st_mtime)
        if latest:
            shutil.copy2(latest, target)
        setattr(context, "_qa_pulse_step_idx", idx + 1)
    else:
        setattr(context, "_qa_pulse_step_idx",
                getattr(context, "_qa_pulse_step_idx", 0) + 1)
```

## Tuning what gets captured

The hook can be selective to avoid blowing up the artifact size:

| Strategy | Cost | When to use |
| --- | --- | --- |
| Every step | Largest. ~50 PNGs per scenario. | Smoke runs you investigate manually. |
| Failed steps only | Smallest. 0–1 PNG per scenario. | Default — good signal/noise. |
| First step + every failed step | Small. | Lets you verify the test set up correctly. |
| First step + last step + failed steps | Slightly larger. | Visual "before/after" without bloat. |

The example patch above uses the third strategy (first step + failed steps).
Adjust the `if status != "failed" and idx not in (0,):` filter to taste.

## How the dashboard hooks them up

`scripts/parse_junit.py::_find_screenshot()` already looks under the
`screenshots-dir` for files matching the scenario slug. To wire step
matches, add a second lookup that scans `STEP_<scenario>_<idx>_*` and
attaches the result to `step.screenshot` in the parser output.

This second lookup is **not yet implemented** in the parser — it's the
follow-up after you decide whether per-step screenshots are worth the
artifact-size cost. Once you commit to it, ping me and I add it
(~15 lines in `parse_junit.py`).
