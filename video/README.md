# KeyMouse — In Full Control

A 56-second, 1080p, 60 fps product film with a 3D flying cursor, steady keyboard
map, dark application workflows, and the original music with rustling removed.

```sh
npm ci
npm run dev -- --no-open
```

Select **KeyMouse** for the current edit. **Saved → KeyMouse-v1** preserves the
original 40-second film. Git tags `codex/keymouse-video-v1` and
`codex/keymouse-video-v2` preserve earlier checkpoints.

The current film groups click examples by input, shows mouse-button feedback
beside the action, animates middle-clicked assets into a browser tab, and uses
a populated board for dragging. Speed and precision have a separate preview
control use case, without combining them with dragging. Large headings and
plus signs are removed; all current demo screens are dark.

```sh
npm run lint                                  # ESLint + TypeScript
npm run build                                 # Bundle
npx remotion render KeyMouse out/keymouse.mp4  # Export on demand
```

All assets are local, with font licenses in `public/fonts`. With numpy,
`python scripts/score.py` rebuilds the current original-music edit and accents;
`python scripts/score-v1.py` rebuilds the original V1 stems.

See [CREATIVE.md](./CREATIVE.md) for the full feedback audit and shot list.
