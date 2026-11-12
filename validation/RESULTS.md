# Validation — 2026-11-12

- Exactly 15 selected journeys calculated and saved, covering 18 mapped endpoints.
- Distances 670.55–9,736.95 m; durations 10.7–147.5 minutes including signal waits.
- All route endpoint identities, timeline continuity, walking speed, waiting totals,
  duration coverage, finite breathing samples and PM2.5 bounds verified.
- All saved wave audits report no route failure and zero closed-signal transmission.
  Bounded refinement remains labelled; no globally optimal-route claim is made.
- 145 saved breathing prediction samples across the selected journeys.
- Missing-temperature samples preserved as unavailable, with the existing model
  imputation retained. No environmental values were fabricated for this release.
- All 1,480 protected native Canopy assets match the source hashes.
- All 1,582 public manifest assets pass SHA-256 and size verification.
- Static publication payload: 490,724,361 bytes. Largest asset: 46,598,142 bytes.
- Nine JavaScript tests passed: saved choices, project-subpath URLs, all-journey
  health/pollution/breathing playback, gzip decoding/integrity, following and score logic.
- The actual GitHub staging script passed and produced `_site` from the verified allowlist.

Browser verification used a plain static HTTP server at `/canopy-demo/`, with no
planner or API implementation, to reproduce a GitHub project Pages subpath.
The full 331-asset city loaded. The route selector offered exactly 15 choices.
The longest 147.5-minute journey loaded from its saved file; scrubbing changed
breathing from 15.99 to 14.92 breaths/min. Loading it re-enabled Follow walker.
Browser console inspection found no errors after loading. No API requests appeared
in the static server log. The browser's unrelated /favicon.ico request returned 404.

Static playback advanced to 82.5 walking seconds and traffic frame 328 while Follow
walker stayed checked; the health score changed from approximately 83.4 to 89.0.
Keyboard activation of an atlas route selected Ariel Way to Shepherds Bush Green,
loaded its saved 12.8-minute journey, and kept Follow walker enabled. A preview image
is included as validation/preview.png. Playback was paused after testing.

The server-side solver was used only for offline generation. Private participant
history, weights, personal baseline, runtime and solver are excluded from this package.
Derived breathing predictions are present, as required for the saved demonstration.

Prepared locally, not deployed: GitHub account/repository settings and a live Pages
deployment still need to be completed. Rendering and transfer speed on other devices
will depend on their browser, graphics hardware and connection.
