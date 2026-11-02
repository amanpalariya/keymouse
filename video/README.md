# KeyMouse — In Full Control

A 48-second product film in 1080p at 60 fps: a 3D flying cursor, steady physical
keyboard map, tall app windows, original music, and quiet tonal accents.

```sh
npm ci
npm run dev -- --no-open
```

Select **KeyMouse** for the current edit. **Saved → KeyMouse-v1** preserves the
original 40-second film with independent sources and audio. The original is
also saved in Git at `codex/keymouse-video-v1` (`5d546ee`).

The opening uses HJKL. Demonstrations prefer arrows and Space. The keyboard
shows all mappings together, with separate inverted-T arrows, Escape, Start,
Slow, and Fast. Active input hints follow the cursor. A slower browser
shot uses a prominent mouse visual to connect selection, clicks, and a new tab,
with Left / Middle / Right controls visible together. Scroll, drag, and speed
have their own demonstrations.

```sh
npm run lint                                  # ESLint + TypeScript
npm run build                                 # Bundle
npx remotion render KeyMouse out/keymouse.mp4  # Export on demand
```

Assets are local; font licenses are in `public/fonts`. Music and sound design
are original. With numpy installed, `python scripts/score.py` rebuilds V2 audio;
`python scripts/score-v1.py` rebuilds original stems in `public/audio/v1`.

See [CREATIVE.md](./CREATIVE.md) for the shot list, timing, and audio direction.
