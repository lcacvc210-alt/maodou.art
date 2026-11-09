# Automatic weekly calendar updates

This workflow is prepared on the local review branch. Nothing is enabled in
GitHub or Vercel by this change alone.

- Schedule: 17:17 Beijing time daily. Sunday's run prepares the following
  Monday's week; Monday to Saturday refresh the current week.
- Sources: the BEA machine-readable release calendar and ONS release search API.
  Only allowlisted indicators with explicit times and confirmed dates are added.
- Data: keep manual rows, forecasts and past weeks. A feed error stops the job
  before writing. An empty week does not advance the displayed week. Re-running
  an unchanged week does not create another commit.
- Market forecasts, China releases, most US releases and company calls are not
  covered by these feeds. Automatic entries have no forecast unless one was
  separately sourced. The BLS calendar returned HTTP 403 during validation.
- Confirmed records may be updated if the source still provides their stable
  identity; absence from a response is not interpreted as cancellation. Check
  publisher notices for withdrawals or rescheduling.

## Preview

```text
node scripts/sync-weekly.mjs --week 2026-11-16
node --test scripts/sync-weekly.test.mjs
```

Without `--write` the script prints candidates and does not change site data.
`--write` applies the merge to the local calendar JSON.
In GitHub Actions, a manual run with `preview_week` also previews without writing
or deploying. Leave it blank for a normal sync.

## Enable after approval

1. Merge the reviewed changes to `main`.
2. In GitHub Actions repository variables, set `WEEKLY_SYNC_AUTHOR_NAME` and
   `WEEKLY_SYNC_AUTHOR_EMAIL` to the approved commit identity linked to the
   existing Vercel project. Keep write permissions scoped to the sync job.
3. Set `WEEKLY_SYNC_ENABLED=true`. Trigger a workflow run and verify the first
   changed-data commit on `main` triggers a successful Vercel deploy and that
   the live calendar advances. Verify branch protection and Vercel author rules
   before relying on unattended publication.
4. To pause, remove `WEEKLY_SYNC_ENABLED` or disable the workflow in GitHub.
   The last published calendar remains available. A revert restores the prior
   data version if needed.
