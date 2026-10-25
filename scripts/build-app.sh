#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
swift build -c release
BIN_DIR="$(swift build -c release --show-bin-path)"
APP="$PWD/dist/Kbd Mouse.app"
mkdir -p "$APP/Contents/MacOS"
cp "$BIN_DIR/KbdMouse" "$APP/Contents/MacOS/KbdMouse"
cp Info.plist "$APP/Contents/Info.plist"
# Set SIGNING_IDENTITY to an Apple Development or Developer ID identity for stable TCC grants.
codesign --force --sign "${SIGNING_IDENTITY:--}" --identifier com.aman.kbdmouse "$APP"
print "Built $APP"
