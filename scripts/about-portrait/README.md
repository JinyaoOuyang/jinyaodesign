# About portrait — generator

`lib/aboutPortrait.ts` is generated, never hand-edited.

- `generate.py` + `vocab_b1.py` — the B2.1 typographic-portrait generator (Pillow + numpy, deterministic seed). Reads `public/about-face-mask.png`. Writes `placed_B2.1.json` next to it.
- `build-data.py` — converts `placed_B2.1.json` into `lib/aboutPortrait.ts`: SVG pen/baseline coordinates, fill-opacity from local tone, story ownership, overlap-checked hit rects.

Neither script ships in the client bundle. Run from the repo root: `python3 scripts/about-portrait/build-data.py`.
