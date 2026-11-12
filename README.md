# Canopy — 15 saved healthy walking journeys

**[Open the live website](https://dodgykid101.github.io/canopy-saved-walks/)**

Published on GitHub Pages. The website works independently of the original computer.

A complete static demonstration of Canopy's Imperial Corridor urban model and
the pedestrian health-route work. Choose one of **15 individual journeys** spanning
different areas and distances. No Python solver, cloud backend, tunnel, model
installation or running home computer is required after GitHub Pages publishes it.

## What visitors can do

- Select a saved journey from the menu, ordered by distance, or its overview-map line.
- See the selected pink route with arrows, compact start/end flags and walking person.
- Play, pause, scrub and change playback speed; Follow walker starts checked and
  is checked again after each saved journey loads.
- Watch the current-condition health score, pollution, temperature and saved breathing
  predictions change with the walking timeline, with red-only plots below the score.
- Explore Canopy's retained full geometry, roads, terrain, native signal placements
  and independent recorded traffic.

The saved walks range from **0.67 km to 9.74 km**, or approximately **11 minutes to
2 hours 28 minutes including waits**. See JOURNEYS.md for the full list. The 15
journeys use 18 endpoint locations collectively; this is not an all-pairs database.
Source road names identify nearby mapped points, not surveyed building entrances.

## Fixed saved settings

All 15 journeys were calculated locally with start time **0** and a **13-hour maximum
journey duration**. Endpoints, start time and the calculation limit are fixed for
each exported journey. Changing playback speed or scrubbing does not recalculate it.
New endpoints or another start time require a new offline calculation and export.
Reverse directions are not included unless listed explicitly.

The original model's limitations remain: synthetic PM2.5, a native 600-second
temperature snapshot sampled along the walk, provisional breathing predictions,
independent modelled pedestrian lights and a bounded route search. These are
research scenario replays, not medically validated advice or surveyed walking access.
Masked temperatures remain unavailable and can make the displayed score unavailable;
the breathing model retains its documented training-mean temperature imputation.

## Publish to GitHub Pages

This folder is the repository root. GITHUB_SETUP.md gives the exact steps. The
included workflow validates and publishes only manifest-listed web assets.
It does not install or run the breathing model on GitHub. Its build-time Python
scripts only verify/copy files; the deployed website is entirely static.

The site is about **491 MB**, below GitHub Pages' documented 1 GB site limit.
The largest file is about 47 MB; use Git to upload the folder because the web file
uploader has a lower per-file limit. Users still download 3D assets through their
browser; a first visit can take time on slower connections.

Source repository: https://github.com/dodgykid101/canopy-saved-walks
The package includes derived route/breathing predictions intended for the demo,
but excludes raw participant history, weights, personal baseline, credentials,
the Python solver and the Windows runtime. See THIRD_PARTY_NOTICES.md for attribution.

## Local checks

`python tools/verify_static.py` checks all saved journeys and protected Canopy hashes.
`node --test tests/*.mjs` checks data loading, health/breathing playback and camera logic.
`python tools/prepare_pages.py` creates the publication folder `_site` from the allowlist.
Use an HTTP server for preview; double-clicking index.html through file:// cannot
provide the browser's service-worker features.

The prepared site was also tested under a repository subpath on a static-only
server, without any `/api` routes. Validation details are in validation/RESULTS.md.

GitHub references checked 2026-11-12:
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
