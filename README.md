# QA Pulse — Multi-Suite Dashboard

Public dashboard that aggregates the latest test results from every mio3-io
test automation suite. Hosted on GitHub Pages, populated by GitHub Actions.

```
sources.yml   →   build.yml   →   public/data/*.json   →   Next.js   →   GH Pages
                                                          ↑
                            gh run download (with DASHBOARD_PAT)
                            from mio3-io/tohkn-testing-suite
                            and  mio3-io/api-automation
```

## What it shows

- **Home (`/`)** — Aggregate KPIs (pass rate, passed/failed/skipped, total
  duration), trend chart across the last 60 aggregated runs, one card per
  suite linking into the detail view.
- **Suite (`/suites/<id>`)** — Per-suite KPIs, feature donuts, tag breakdown.
- **Features (`/suites/<id>/features`)** — Every scenario with status,
  duration, Behave tags, failure messages and screenshot links.
- **Screenshots (`/suites/<id>/screenshots`)** — Masonry gallery of failure
  screenshots with a lightbox.
- **Allure (`/allure/<id>/`)** — Full Allure HTML report per suite.

## Local development

```bash
npm install
npm run dev    # http://localhost:3000
```

Ships with realistic example data so the UI renders without any real run.

## Adding a new suite

1. Append an entry to [sources.yml](./sources.yml).
2. Ensure the source repo's workflow uploads three artifacts:
   - `junit-reports`        → Behave JUnit XML (`reports/junit/`)
   - `failure-screenshots`  → PNGs named `FAIL_<scenario>_<ts>.png`
   - `allure-results`       → Raw Allure results
3. Re-run the **QA Dashboard** workflow.

No frontend code changes required — the UI is fully driven by `sources.yml`
and the JSON contract.

## Stack

- Next.js 14 (App Router, static export)
- Tremor + Tailwind CSS (dark theme with vibrant gradient accents)
- Framer Motion (entry animations + lightbox)
- Lucide icons, date-fns
- Python (`scripts/parse_junit.py`, `scripts/aggregate.py`)

See [SETUP.md](./SETUP.md) for first-time deployment instructions.
