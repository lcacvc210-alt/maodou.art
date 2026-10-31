# Maodou Weekly V1 Integration

## Hosting and Routing

- Repository: https://github.com/lcacvc210-alt/maodou.art.git
- Vercel project: lcacvcs-projects/maodou-art
- Production deploys automatically when `main` is pushed.
- Previous production commit: `d688731bd4c98df4fe0dd6016efd25e20ba6048a`.
- Entry: https://maodou.art/weekly/
- Next.js retains its existing trailing-slash normalization: `/weekly/` redirects
  to `/weekly`, which rewrites internally to `/weekly/index.html`.
- The HTML base `/weekly/` ensures CSS, JS and JSON resolve correctly for all
  three entry URLs. Existing route normalization is unchanged.
- Desktop and mobile navigation use ordinary anchors to load the standalone
  static document. The weekly header links back to the main site.
- All assets are in `public/weekly/`. No new API routes or Python dependencies.

## Source Package

Source project: `C:/Users/LC/Documents/ChatGPT/消息周报`.
Only the contents of the upload ZIP's `weekly/` directory were imported.
Neither ZIP, source management configuration, screenshots nor local API server
is published through the website.

SHA256 of supplied archives:

- Upload: `abe8e4d52b8df94545ea59b490faba792fb52bdfdae808323d083cbc6c4eb972`
- Source: `200777a995693b63a18994b50539f8262910047b5cb534735c34747768d723ff`

Integration changes: fixed resource base, main-site return link, explicit data
and capability notice, dynamic historical-week labels in Asia/Shanghai,
functional card-pack expansion and defensive parsing of stored favorites.
Do not overwrite these adaptations blindly when importing a later release.

## Data and Maintenance

The supplied published JSON is unchanged: eight events for November 2-8, 2026,
verified October 31, 2026. Technology has two events, finance six. Thursday has
four events. Qualcomm's 05:45 and Arm's 06:00 are calls/webcasts, not precise
financial-document release times. All displayed times are Asia/Shanghai.

This edition does not update automatically. It remains on the original week;
other weeks remain empty, and past editions display a historical label.
Favorites are local browser storage only. There is no account sync, push,
automatic collection or editing backend. Ranking is editorial, not live heat.

For updates, verify official sources, edit the source project's published data,
and run its validation/release workflow. Then update only the reviewed static
files, preserving integration changes, build, preview and deploy via `main`.
Changing the date without reverifying events is not an update.

## Validation

Before deployment: `node --check public/weekly/app.js`, targeted ESLint for
`next.config.ts` and `src/components/Header.tsx`, and `npm run build`.

Browser QA uses Edge at desktop 1440px and mobile 390px: all entry URLs and
assets; old homepage/blog/tools/article API; navigation in both layouts; all
eight details and source URLs; filters; empty adjacent weeks; hover height;
expand/collapse; keyboard details and favorites; persisted follow/unfollow and
theme; mobile overflow/date navigation; simulated historical date. Compare
published JSON with the supplied archive. Repeat against the production URL.

## Rollback

Revert the weekly integration commit on `main` and push to trigger Vercel:

```text
git switch main
git revert --no-edit <weekly-integration-commit>
git push origin main
```

This removes the integration while retaining later unrelated commits. Do not
reset or force-push `main`. For urgent recovery, Vercel can restore the previous
successful deployment of commit `d688731bd4c98df4fe0dd6016efd25e20ba6048a`;
follow with a Git revert so the repository and production agree.
