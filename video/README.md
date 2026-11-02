# KeyMouse — In Full Control

A 40-second product film in 1080p at 60 fps. Real beveled 3D cursor, animated
keyboard demonstrations, an original 120 BPM instrumental score, and custom
tonal sound design.

```sh
npm ci
npm run dev -- --no-open
```

Open the Studio URL and select **KeyMouse**. Scene compositions are available
under **Scenes**. Press Space in Studio to play with audio.

The film demonstrates activation, directional movement, left click, vertical
and horizontal scrolling, text selection, double-click, context menus, middle
click, drag-and-drop, speed modifiers, and the app's Motion settings.

```sh
npm run lint                                  # ESLint + TypeScript
npm run build                                 # Build a portable bundle
npx remotion render KeyMouse out/keymouse.mp4  # Export on demand
```

All assets are local. Font licenses are in `public/fonts`. Score and sound
design are original and have no third-party samples. To regenerate them,
install numpy in your Python environment and run `python scripts/score.py`.

See [CREATIVE.md](./CREATIVE.md) for the shot list, timing, and audio direction.
Demonstration surfaces are animated illustrations; the settings shot is taken
from the actual KeyMouse app.
