# Blue Hero motion QA

## Gate summary

| Gate | Status | Evidence |
|---|---|---|
| Target attribution | PASS | `scout-card.json` |
| Target lock | PASS | `scout-card.json` |
| Replay ready | PASS | `replay-manifest.json` |
| Source to immutable reference baseline | PASS | `source-reference.json` |
| Reference baseline to APPDO Hero | PASS | Browser QA below |

## Browser QA

- Local URL: `http://127.0.0.1:4191/`.
- Desktop `1440 x 900`: motion root ready, exactly two canvases, WebGL 1.0 compiled.
- Desktop WebGL band and its canvas both measure `1440 x 800.39`; no horizontal clipping edge remains.
- Dark mode uses a screen-blended royal-blue band over a blue dot field.
- Light mode remains readable and uses `opacity: 0.34` plus `mix-blend-mode: multiply`.
- Pointer movement to `(1120, 420)` moved the SVG glow to local `(1127.5, 356)` with visible opacity, confirming live pointer input.
- Mobile `390 x 844`: motion root ready, two canvases, no positive horizontal overflow.
- Mobile backing stores: dot `390 x 789`; band `390 x 1184` at DPR 1.
- The effect remains limited to the Hero wrapper; later sections keep the existing APPDO surface.
- Browser warnings and errors: none.

## Build QA

- `npm run lint`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS using Next.js 16.2.9 static export.
- `git diff --check`: PASS.

## Verdict

`PASS - DONE_PROJECTIZED_LOCAL_ONLY`
