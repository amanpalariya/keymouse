# KeyMouse — In Full Control / V4

74 seconds · 1920 × 1080 · 60 fps · 120 BPM

A dark product film built around recognizable tasks. The application content
uses the former title space. There are no large action headings or plus-sign
separators. Tall windows extend below the frame, with compact input feedback
beside the action and a small reference dock.

| Time  | Use case                 | What the viewer sees                                                                                                                     |
| ----- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 00–04 | Stay on the keys         | Beveled 3D flying cursor and HJKL                                                                                                        |
| 04–14 | Understand the keyboard  | Stable map, alias highlights, mouse moving with HJKL/arrows and lighting left/middle/right for W/E/R                                     |
| 14–40 | Prepare a release note   | Space checks an item and selects a word; separate R examples on text and an image; E flies an asset into a new browser tab               |
| 40–48 | Browse the linked assets | Shift and arrows scroll a populated grid, with pauses to see the result                                                                  |
| 48–58 | Reach two small controls | F and an arrow cross the preview; D and an arrow make the accurate final approach. Repeat in the opposite direction, holding each result |
| 58–70 | Move tasks to Done       | Two separate Space-and-arrow drags on a populated board, with pickup, movement, release and result holds                                 |
| 70–74 | Every move. Yours        | 3D cursor fly-out; Option to Start, Escape to Stop                                                                                       |

## Current controls and visual decisions

- Intro HJKL stay in place. The practical demos prefer arrows and Space.
- The keyboard overview retains every mapping in one layout. Only movement
  and the three click actions animate, followed by a quiet reading hold.
- Equivalent pairs highlight together: H/←, J/↓, K/↑, L/→, and W/Space.
- Arrow keys are four separate keys in an inverted T; Escape is visible.
- Labels are Option **START**, Escape **STOP**, D **SLOW**, and F **FAST**.
- W, E, and R each stay highlighted for about 0.75 seconds. A mouse diagram
  shows the corresponding button. Its lower body is hidden behind the keyboard,
  and both share one perspective transform. HJKL/arrow movement shifts the
  mouse in sync; it stops during clicks. The pointer stays beside W/E/R
  during those presses rather than moving in response to clicks.
- The click examples are grouped: Space examples, then two R examples, then E.
  A click only labels that click key, without distracting movement chords.
- Selection is a standard double-click word selection. The right-click cases
  show distinct text and image context menus and linger, without mixing in a
  left-click menu choice. There is no mouse overlay in the click scene and
  links carry no northeast arrow or other new-tab hint.
- The E case visibly flies the asset tile into the real tab strip, then holds
  the completed tab. The linked asset browser follows in the next scene.
- Every current application scene and popup is dark. The board and release
  page contain useful app data rather than marketing paragraphs.

- Every scene boundary has an 18-frame crossfade with overlap accounted for
  in the timeline. Menus and precision tooltips ease in/out; dragged cards
  lift and settle smoothly. Extra holds preserve input speed while allowing
  time to see completed results.
- Fast/slow and drag remain separate use cases. Direction badges appear
  beside the pointer as well as in the reference dock for both.

## Audio

The earlier V2 melody, chords, bass, pluck sounds, low rhythm, and tempo are
preserved. Only the random noise layers — brushed hats, snare texture, and
noisy kick attack — were removed. No replacement song or woodblock pattern.
The existing tonal UI accents remain quiet. No swipes or movement effects.

Current 48 kHz stereo assets:

- `public/audio/in-full-control-original-clean-v4.wav`
- `public/audio/workflow-accents-v4.wav`

`python scripts/score.py` rebuilds these tracks with numpy. Unique asset names
ensure Studio loads the replacement rather than cached audio.

## Checkpoints

V1 is saved at Git tag `codex/keymouse-video-v1` (`5d546ee`) and remains playable
under **Saved → KeyMouse-v1** with independent sources and original audio.
V2 is preserved at `codex/keymouse-video-v2` (`7afaa3c`) and V3 at
`codex/keymouse-video-v3` (`226afe1`). V4 is saved at
`codex/keymouse-video-v4`. The default **KeyMouse**
composition is the current edit. Historical versions retain their original
appearance and sound.

## Editing

`npm run dev -- --no-open` starts Studio. Feature scenes are registered under
**Scenes**, including focused Select and Context views. `npm run lint` runs
ESLint and TypeScript; `npm run build` bundles the project. Fonts and media
are local. Demo interfaces illustrate real KeyMouse controls; they are not
screen recordings.

Export on demand: `npx remotion render KeyMouse out/keymouse.mp4`.
