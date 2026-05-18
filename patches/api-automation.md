# Patch — mio3-io/api-automation

Add three artifact uploads to each workflow that runs tests. The dashboard
pulls these by name; if any are missing it falls back gracefully but you'll
lose part of the report (e.g. no Allure tab, no screenshots).

## 1 · For each existing workflow

Apply to these files:

- `.github/workflows/signup_kyckyb.yml`
- `.github/workflows/payment_order.yml`
- `.github/workflows/parallel_flows.yml`
- `.github/workflows/generate_token.yml`

Add (or replace, if it already exists) these steps **after** the `behave` run
step and **before** the existing Allure HTML upload:

```yaml
      - name: Upload JUnit reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: junit-reports
          path: reports/junit/
          if-no-files-found: warn
          retention-days: 30

      - name: Upload Allure results (raw)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results
          path: reports/allure-results/
          if-no-files-found: warn
          retention-days: 30

      - name: Upload Sumsub failure screenshots
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: failure-screenshots
          # Sumsub flow writes a per-run folder; grab whatever PNGs exist.
          path: |
            reports/sumsub_flow_*/**/*.png
            reports/screenshots/**
          if-no-files-found: ignore
          retention-days: 30
```

The existing `allure-html-report-*` step can stay — it's a *different*
artifact (the rendered HTML), used by humans browsing the run page directly.
The dashboard uses the raw `allure-results` so it can render its own version
under `/allure/api/`.

## 2 · (Optional) Instant dashboard refresh

After the last step of each workflow, add:

```yaml
      - name: Poke QA dashboard to rebuild
        if: success() && github.ref == 'refs/heads/main'
        env:
          GH_TOKEN: ${{ secrets.DASHBOARD_DISPATCH_TOKEN }}
        run: |
          gh api repos/mio3-io/qa-dashboard/dispatches \
            -f event_type=test-run-finished \
            -f client_payload[suite]=api \
            -f client_payload[run]=${{ github.run_id }}
```

This requires a second token: a fine-grained PAT scoped to
`mio3-io/qa-dashboard` with **Contents: Read-only** + **Actions: Read & Write**
(needed for dispatch). Store it in *this* repo as secret
`DASHBOARD_DISPATCH_TOKEN`.

Without this step the dashboard still refreshes daily at 09:00 UTC and on
manual dispatch — the poke just makes it instant.

## 3 · Verify the artifacts

After re-running any workflow, open its run page on GitHub and scroll to
**Artifacts**. You should see four entries:

- `allure-html-report-signup` (existing)
- `junit-reports` ← new
- `allure-results` ← new
- `failure-screenshots` ← new (may be empty if no failures)

If `junit-reports` is missing, the dashboard will skip the suite entirely.
