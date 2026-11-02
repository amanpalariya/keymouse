# KeyMouse — In Full Control / V2

48 seconds · 1920 × 1080 · 60 fps · 120 BPM

A product film with short action titles, a steady keyboard overview, tall app
windows that extend below the frame, and floating input displays. The opening
keeps HJKL beneath the sculpted 3D cursor. Demonstrations use arrows and Space.

| Time  | Shot                                      | Inputs and behavior                                                                                       |
| ----- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 00–04 | Stay on the keys. 3D fly-in.              | HJKL keycaps                                                                                              |
| 04–14 | Steady keyboard map.                      | Pointer movement and three clicks only, followed by a calm hold                                           |
| 14–20 | Gallery window.                           | Shift + ↓ / ↑ / →; vertical and horizontal scrolling                                                      |
| 20–34 | Slower, continuous browser demonstration. | Short selection, double-click, context menu, and a browser tab; a large mouse visual shows button presses |
| 34–40 | Launch board.                             | Hold Space + →, release to drop                                                                           |
| 40–44 | Motion window.                            | F + → for speed; D + → for precision                                                                      |
| 44–48 | Every move. Yours. 3D fly-out.            | Option: Start; Escape: Stop                                                                               |

## Visual controls

The physical keyboard stays in one layout with every mapping visible. Only
pointer movement and the three click keys animate. The board then lingers
without extra key presses so the viewer can absorb it. W/E/R
are arranged as left/middle/right click controls, and HJKL carry direction
arrows. Space is the primary left-click input in demonstrations. Equivalent keys
highlight together: H/←, J/↓, K/↑, L/→, and W/Space. Cursor hints show the
primary arrow or Space input. Arrow keys
are four separate keys in an inverted T. Escape is in the function row.
Option is labeled **START**, Escape **STOP**, D **SLOW**, and F **FAST**.
Scrolling and speed have dedicated app-window demos rather than changing
the overview into a sequence of explanations.

The 14-second click sequence uses just “Make it move” as selectable text and
a prominent mouse illustration with synchronized left, middle, and right
button highlights. It keeps Left / Space, Middle / E, and Right / R
visible together in one floating bar. Selection, double-click, context menu,
and the new browser tab all happen in the same window. The selection width
and cursor hotspot share one eased coordinate after locally loaded text is
measured, so the highlight edge cannot outrun the pointer. Middle-click
animates a new background tab into the browser's actual tab strip.

## Audio

The original 120 BPM musical theme is retained and extended to 48 seconds.
There are no air sweeps, reverse noise, risers, or continuous movement sounds.
Discrete presses and edits use quieter, short electric-piano tine accents.
Both stems are original synthesized audio with no third-party samples.

The 48 kHz stereo tracks are in `public/audio`. Rebuild them with
`python scripts/score.py` (numpy required).

## Saved V1

The original 40-second film was committed before revision as `5d546ee`, tagged
`codex/keymouse-video-v1`. Independent scene sources and both original audio
stems are also retained in `src/versions/v1` and `public/audio/v1`.

Open **Saved → KeyMouse-v1** to compare without restoring files. The default
**KeyMouse** composition is the current edit. V1 source and audio were checked
against the tagged version.

## Editing

`npm run dev -- --no-open` starts Studio. Current scenes are individually
registered in **Scenes**; **Clicks** is the complete continuous click sequence.
The Select and Context registrations open focused portions of that sequence.
Fonts and audio are local. Demo windows illustrate actual KeyMouse behavior;
they are not screen recordings.

`npm run lint` checks ESLint and TypeScript. `npm run build` bundles the film.
Export on demand: `npx remotion render KeyMouse out/keymouse.mp4`.
