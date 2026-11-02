# KeyMouse — In Full Control / V5

78 seconds · 1920 × 1080 · 60 fps · 120 BPM

A dark product film built around recognizable tasks. The application content
uses the former title space. There are no large action headings or plus-sign
separators. Tall windows extend below the frame, with compact input feedback
beside the action and a small reference dock.

| Time  | Use case           | What the viewer sees                                                                                                                                                                                |
| ----- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00–04 | Stay on the keys   | Beveled 3D flying cursor and HJKL                                                                                                                                                                   |
| 04–14 | Keyboard overview  | Preserved V4 keyboard, shared mouse perspective, aliases and sustained click highlights                                                                                                             |
| 14–40 | Research a lake    | A minimal Wikipedia reading view: select the depth fact, R → Copy, R → Save Image As → Save, and E on Crater Lake to compare in a new background tab                                                |
| 40–62 | Scroll and retouch | One continuous photo editor and canvas. Scroll vertically and horizontally, then normal → fast → slow movement to heal two small spots. The viewport, zoom, tool, cursor position and image persist |
| 62–74 | Move and reorder   | Drag Launch video to the right, release it, then pick up the same card and drag downward. App icon moves up to make the new ordering clear                                                          |
| 74–78 | Every move. Yours  | 3D cursor fly-out; Option to Start, Escape to Stop                                                                                                                                                  |

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
- The click examples follow research tasks: copy a fact, save a photo, and
  open a related article to compare. Each result gets a reading hold.
  The menu choices now complete useful tasks rather than dismissing the menu.
  Key feedback identifies the action being performed.
- Selection follows a horizontal text drag and remains synchronized with the
  pointer. The right-click cases show distinct text and image context menus
  and linger before the menu choice. Space chooses Copy and saves the image, with visible
  results and pauses. There is no mouse overlay in the click scene and
  links carry no northeast arrow or other new-tab hint.
- The E case visibly flies the Crater Lake link into the real tab strip, then holds
  the completed tab. The source article stays open while Crater Lake opens
  in the background.
- Every current application scene and popup is dark, with neutral application
  colors independent of the film branding. Wikipedia uses a minimal reading view with real article facts and photography.
  There is no invented release-note website or footer. Keyboard hints sit above
  each application window, never over cards or canvas content.
- The article uses one grid and shared header alignment, with larger reading
  sizes: 46 px title, 20 px body/facts, 18 px fact labels and 16 px navigation.
  Pointer, selection and link targets are measured after fonts load, keeping
  every action aligned as type sizes or layout change.
- The board has a Trello-style workspace sidebar, view tabs, filter and avatar.
  The pointer stays on the card after each drop. During the downward reorder,
  App icon stays in its slot until the crossing threshold, then slides quickly
  into the top slot independently of the dragged card.
- Released pointer key badges hold for 0.18 seconds and fade over 0.5 seconds.
  Actual pressed states, clicks and keycaps still release at their real time.
  This is deterministic for playback, seeking and rendering.

- Every separate scene boundary has an 18-frame crossfade with overlap accounted for
  in the timeline. The scroll-to-retouch boundary has been removed entirely. Menus ease in/out; dragged cards
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

- `public/audio/in-full-control-original-clean-v5.wav`
- `public/audio/workflow-accents-v5-final.wav`

`python scripts/score.py` rebuilds these tracks with numpy. Unique asset names
ensure Studio loads the replacement rather than cached audio.

## Checkpoints

V1 is saved at Git tag `codex/keymouse-video-v1` (`5d546ee`) and remains playable
under **Saved → KeyMouse-v1** with independent sources and original audio.
V2 is preserved at `codex/keymouse-video-v2` (`7afaa3c`) and V3 at
`codex/keymouse-video-v3` (`226afe1`). V4 is saved at
`codex/keymouse-video-v4` (`7da1be4`). V5 is saved at
`codex/keymouse-video-v5`. The default **KeyMouse**
composition is the current edit. Historical versions retain their original
appearance and sound.

## Assets

See [asset provenance and generation prompt](public/ASSETS.md). The Wikipedia
article and embedded photograph retain their source attribution. The separate
editor photograph was created with the built-in image-generation tool.

## Editing

`npm run dev -- --no-open` starts Studio. Feature scenes are registered under
**Scenes**, including focused Select and Context views. `npm run lint` runs
ESLint and TypeScript; `npm run build` bundles the project. Fonts and media
are local. The browser content is a simplified reading view of the real Wikipedia article;
the input, menu, dialog and tab animations illustrate real KeyMouse controls.
The photo editor and board are code-native application illustrations.

Export on demand: `npx remotion render KeyMouse out/keymouse.mp4`.
