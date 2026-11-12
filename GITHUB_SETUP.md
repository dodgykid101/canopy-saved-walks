# Publish this static edition

This copy is now published at https://dodgykid101.github.io/canopy-saved-walks/.
The steps below are for publishing another copy or fork.

1. Create an empty GitHub repository, for example `canopy-saved-walks`.
   GitHub Free supports Pages from public repositories. Review the included derived
   scenario outputs and upstream attribution before making the repository public.
2. Extract the package and open a terminal **inside this folder**, not its parent
   AI and Health folder. Upload the extracted files with Git, not the ZIP as a file:

```sh
git init -b main
git add .
git commit -m "Add Canopy with 15 saved healthy walking journeys"
git remote add origin https://github.com/YOUR-ACCOUNT/canopy-saved-walks.git
git push -u origin main
```

3. On GitHub, open Settings > Pages. Set Source to **GitHub Actions**.
4. Open Actions > Publish saved Canopy journeys > Run workflow on main. If the first
   automatic run failed because Pages was not enabled yet, rerun it now.
5. After the workflow succeeds, the Pages environment links to the website:
   `https://YOUR-ACCOUNT.github.io/canopy-saved-walks/`.

That address is an example until you create the repository. The site remains usable
when the original computer is off, subject to GitHub's service and usage limits.
There is no Render account, cloud Python process, Cloudflare tunnel, API key or
private model bundle to configure for this edition.

## Files to keep

Upload this complete extracted folder, including `.github/workflows/pages.yml` and
`.nojekyll`. Do not add the older full Windows ZIP, private-inputs folder, participant
CSV, model weights or personal baseline. The workflow stages only the files listed
in download-manifest.json, then publishes them from `_site`.

## Updating journeys later

Run new calculations in the private local working copy, export only the intended
derived route outputs, update saved-routes/catalog.json and the public asset hashes,
then run the checks before pushing. The route selector must offer only actual saved
results. Do not silently substitute another route or invent breathing values.

## Collaborators integrating into newer Canopy

Preserve the receiver's newer roads, traffic, signal system and fields. This package
contains saved results tied to the 2026.11.11 integrated network. If that topology,
signals or environmental inputs change, recalculate the affected journeys rather
than labelling these old results as calculations on the new model. Use genuine native
pedestrian phases when available; the current modelled pedestrian lights are a fallback.
