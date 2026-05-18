# Setup — first-time deployment

Step-by-step to take this folder from local files to a live public dashboard at
`https://mio3-io.github.io/qa-dashboard/`.

## 1 · Create the repo on GitHub

```bash
# from this folder
gh repo create mio3-io/qa-dashboard --public --source=. --remote=origin --push
```

If you prefer the UI: create `mio3-io/qa-dashboard` (public, no README/license),
then:

```bash
cd ~/Documents/qa-dashboard
git init
git add .
git commit -m "feat: initial multi-suite QA dashboard"
git branch -M main
git remote add origin git@github.com:mio3-io/qa-dashboard.git
git push -u origin main
```

## 2 · Create the fine-grained PAT

Both source repos (`tohkn-testing-suite`, `api-automation`) are private, so the
dashboard needs a token to download their artifacts.

1. Go to **github.com → Settings → Developer settings → Personal access tokens
   → Fine-grained tokens → Generate new token**.
2. **Resource owner**: `mio3-io` (org).
3. **Repository access** → "Only select repositories" → pick
   `tohkn-testing-suite` and `api-automation`.
4. **Repository permissions**:
   - **Actions** → Read-only
   - **Contents** → Read-only
   - **Metadata** → Read-only (selected automatically)
5. **Expiration**: 90 days (set a calendar reminder to rotate).
6. Copy the token (`github_pat_…`).

If your org requires PAT approval, an org owner has to approve the request
(Settings → Personal access tokens → Pending requests).

## 3 · Add the PAT as a secret

In `mio3-io/qa-dashboard` → **Settings → Secrets and variables → Actions →
New repository secret**:

- Name: `DASHBOARD_PAT`
- Value: paste the token

## 4 · Enable GitHub Pages

`mio3-io/qa-dashboard` → **Settings → Pages → Build and deployment**:

- **Source**: `GitHub Actions`

That's it — no branch selection needed; the workflow uses the modern Pages
deploy action.

## 5 · Apply the artifact patches to each source repo

Both source repos need to upload three artifacts so the dashboard can read
them. See [`patches/api-automation.md`](./patches/api-automation.md) for the
exact patches to apply to `mio3-io/api-automation`.

`tohkn-testing-suite` is already patched (see its `.github/workflows/android-tests.yml`).

## 6 · First run

1. In `tohkn-testing-suite` → Actions → **Android Appium Tests** → Run workflow.
2. In `api-automation` → Actions → **SignUp - KYC/KYB Flow** → Run workflow.
3. Wait for both to finish successfully.
4. In `qa-dashboard` → Actions → **QA Dashboard** → Run workflow.
5. After deploy, open the URL printed in the deploy step
   (`https://mio3-io.github.io/qa-dashboard/`).

The daily 09:00 UTC cron will refresh the dashboard from then on, even if no
new pushes happen.

## 7 · (Optional) Instant refresh after a test run

By default the dashboard re-builds:
- Manually (workflow_dispatch)
- Daily (cron)
- On `repository_dispatch` event `test-run-finished`

To wire up instant rebuilds: at the end of each source workflow, add a step
that pokes the dashboard via `repository_dispatch`. See the bottom of
[`patches/api-automation.md`](./patches/api-automation.md).

## Common issues

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Resource not accessible by personal access token` | Org PAT policy or missing approval | Org owner approves the token in Settings → PAT requests |
| Dashboard shows example data only | No successful run found on `main` for one or both suites | Re-run the source workflow; check that `branch: main` matches in `sources.yml` |
| Allure tab 404 | `allure-results` artifact missing | Add the upload step from `patches/api-automation.md` |
| Screenshots are broken images | Source repo isn't uploading `failure-screenshots` | Add the upload step; check `if-no-files-found: ignore` is set |

## Rotating the PAT

Every 90 days:
1. Create a new fine-grained PAT with the same scopes.
2. Update the `DASHBOARD_PAT` secret in `mio3-io/qa-dashboard`.
3. Revoke the old token.
