# KeyMouse — In Full Control

40 seconds · 1920 × 1080 · 60 fps · 120 BPM

A product film about keeping your hands on the keyboard and staying in flow.
Beveled 3D cursor, icy blue light, large Manrope typography, floating keycaps,
bright demo surfaces, and music-synced cuts with smooth movement inside each shot.
Demonstration interfaces are animated illustrations of real KeyMouse controls;
the Motion settings shot uses the app's actual screenshot.

| Time  | Shot                                  | Actual controls demonstrated                    |
| ----- | ------------------------------------- | ----------------------------------------------- |
| 00–04 | Stay on the keys. 3D cursor fly-in.   | H J K L identity                                |
| 04–10 | Activate, move, click.                | Tap Option; H J K L; Space left click           |
| 10–16 | Scroll vertically and horizontally.   | Hold Shift + J / K / L                          |
| 16–22 | Select text, double-click a word.     | Hold Space + L; tap W twice                     |
| 22–26 | Context menu, open a new browser tab. | R right click; Space choose; E middle click     |
| 26–32 | Drag a task from Ideas to Done.       | Hold Space + L; F to move faster; release Space |
| 32–36 | Fast, precise, configurable.          | F 3×; D ¼×; actual Motion settings              |
| 36–40 | Every move. Yours. Cursor fly-out.    | Option to start; Esc to stop                    |

## Audio

Original instrumental score and sound design, synthesized for this film using
`scripts/score.py`. Warm sub, tight electronic percussion, wide suspended pads,
and a sparse glass mallet motif in D minor. UI actions have tuned glass accents
and rising confirmations. Editorial cuts use stereo air and low impacts.
No stock music and no mouse-click recordings.

Assets are 48 kHz stereo WAVs, with score and sound design on separate editable
timeline tracks. The final mix leaves headroom and fades out at the end.

## Editing and playback

`npm run dev -- --no-open` starts Remotion Studio. Select `KeyMouse` for the full
film. Every scene is also registered inside `Scenes` for focused editing.

`npm run lint` checks source and TypeScript. Fonts are locally bundled with their
OFL licenses, and the film does not rely on remote assets during playback.

To rebuild audio: install numpy in your Python environment, then run
`python scripts/score.py`.

To export when desired: `npx remotion render KeyMouse out/keymouse.mp4`.
