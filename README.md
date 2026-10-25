# Kbd Mouse

Native macOS app with keyboard pointer controls and a menu bar shortcut. macOS 14 or later; no dependencies.

```sh
./scripts/install-app.sh
open "/Applications/Kbd Mouse.app"
```

The app opens with setup instructions. Click **Allow Access**, then turn on **Kbd Mouse** in System Settings → Privacy & Security → Accessibility. If it is missing, use **+** to select it from Applications. The app checks access automatically. If a locally rebuilt app is already enabled but still unavailable, remove its old entry with **−**, then use **+** to add the current copy from Applications.

**Launch at login** is enabled on first launch. Turn it off in General settings. macOS may require approval in Login Items; the app shows a link when needed. Later changes made in macOS Settings are respected.

Open Kbd Mouse from Applications or the Dock at any time, even when its menu bar icon is hidden. Enable **Show in menu bar** in General settings to restore it. Closing the window keeps keyboard controls running; use **Quit** to exit.

Double-tap **Option** to toggle keyboard control. **Escape** cancels; 30 seconds of inactivity also stops it. Change these in Settings.

| Keys | Action |
| --- | --- |
| Arrows / H J K L | Left, down, up, right |
| Space / W | Left button |
| E | Middle button |
| R | Right button |
| Hold A | Fast |
| Hold S | Slow |
| Hold F | Scroll |

Hold a button key while moving to drag. Combine controls: **S + F + J** scrolls down slowly. Double-click by tapping twice. A badge follows the cursor while active. Settings persist automatically; settings changes stop an active session.

Bindings use physical US keyboard positions, independent of input language. Other keys pass through. Secure input fields and macOS-protected surfaces may prevent event capture.

## Development

```sh
swift test # Requires Xcode (XCTest is not included in standalone Command Line Tools).
```

The build script uses ad-hoc signing by default. For stable Accessibility permissions across rebuilds, supply `SIGNING_IDENTITY` with an installed Apple signing identity. Distribution requires Developer ID signing and notarization. The app uses a filtering Core Graphics event tap and is built without App Sandbox.

Use `./scripts/build-app.sh` to build without installing. Run the app bundle rather than `swift run`, so permissions belong to the app.

Built with SwiftUI [MenuBarExtra](https://developer.apple.com/documentation/swiftui/menubarextra), [Service Management](https://developer.apple.com/documentation/servicemanagement/smappservice), and [Core Graphics event taps](https://developer.apple.com/documentation/coregraphics/cgevent).
