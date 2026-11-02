# KeyMouse — In Full Control / V3

56 seconds · 1920 × 1080 · 60 fps · 120 BPM

A dark product film built around recognizable tasks. The application content
uses the former title space. There are no large action headings or plus-sign
separators. Tall windows extend below the frame, with compact input feedback
beside the action and a small reference dock.

| Time  | Use case                     | What the viewer sees                                                                                                                |
| ----- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 00–04 | Stay on the keys             | Beveled 3D flying cursor and HJKL                                                                                                   |
| 04–14 | Understand the keyboard      | A steady full map, equivalent keys lighting together, and W/E/R lighting the mouse's left/middle/right buttons                      |
| 14–36 | Prepare a release note       | Space checks an item and selects a word; two separate R examples show text and link menus; E sends the asset into a new browser tab |
| 36–42 | Browse the linked assets     | The opened tab becomes active; Shift and arrow keys scroll the populated asset grid                                                 |
| 42–46 | Find a small preview control | F crosses the preview quickly; D makes the last approach to its small play button. No dragging in this case                         |
| 46–52 | Move a task to Done          | A populated three-column board; hold Space, move, and release. No speed modifiers in this case                                      |
| 52–56 | Every move. Yours            | 3D cursor fly-out; Option to Start, Escape to Stop                                                                                  |

## Current controls and visual decisions

- Intro HJKL stay in place. The practical demos prefer arrows and Space.
- The keyboard overview retains every mapping in one layout. Only movement
  and the three click actions animate, followed by a quiet reading hold.
- Equivalent pairs highlight together: H/←, J/↓, K/↑, L/→, and W/Space.
- Arrow keys are four separate keys in an inverted T; Escape is visible.
- Labels are Option **START**, Escape **STOP**, D **SLOW**, and F **FAST**.
- W, E, and R each stay highlighted for about 0.75 seconds. A mouse diagram
  shows the corresponding button. The pointer stays still beside W/E/R
  during those presses rather than moving in response to clicks.
- The click examples are grouped: Space examples, then two R examples, then E.
  A click only labels that click key, without distracting movement chords.
- Selection is a standard double-click word selection. The right-click cases
  show the result and linger, without mixing in a left-click menu choice.
- The E case visibly flies the asset tile into the real tab strip, then holds
  the completed tab. The linked asset browser follows in the next scene.
- Every current application scene and popup is dark. The board and release
  page contain useful app data rather than marketing paragraphs.

## Audio

The earlier V2 melody, chords, bass, pluck sounds, low rhythm, and tempo are
preserved. Only the random noise layers — brushed hats, snare texture, and
noisy kick attack — were removed. No replacement song or woodblock pattern.
The existing tonal UI accents remain quiet. No swipes or movement effects.

Current 48 kHz stereo assets:

- `public/audio/in-full-control-clean-v3.wav`
- `public/audio/grouped-click-accents-v3.wav`

`python scripts/score.py` rebuilds these tracks with numpy. Unique asset names
ensure Studio loads the replacement rather than cached audio.

## Checkpoints

V1 is saved at Git tag `codex/keymouse-video-v1` (`5d546ee`) and remains playable
under **Saved → KeyMouse-v1** with independent sources and original audio.
V2 is preserved at `codex/keymouse-video-v2` (`7afaa3c`). The default **KeyMouse**
composition is the current edit. Historical versions retain their original
appearance and sound.

## Editing

`npm run dev -- --no-open` starts Studio. Feature scenes are registered under
**Scenes**, including focused Select and Context views. `npm run lint` runs
ESLint and TypeScript; `npm run build` bundles the project. Fonts and media
are local. Demo interfaces illustrate real KeyMouse controls; they are not
screen recordings.

Export on demand: `npx remotion render KeyMouse out/keymouse.mp4`.
