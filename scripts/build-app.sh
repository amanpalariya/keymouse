#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
swift build -c release
BIN_DIR="$(swift build -c release --show-bin-path)"
APP="$PWD/dist/KeyMouse.app"
mkdir -p "$APP/Contents/MacOS"
mkdir -p "$APP/Contents/Resources"
swiftc -parse-as-library scripts/render-icon.swift -o .build/render-icon
.build/render-icon .build/AppIcon.iconset Sources/KeyMouse/Resources/AppIcon.png
iconutil -c icns .build/AppIcon.iconset -o "$APP/Contents/Resources/KeyMouseIcon.icns"
cp Sources/KeyMouse/Resources/AppIcon.png "$APP/Contents/Resources/AppIcon.png"
cp "$BIN_DIR/KeyMouse" "$APP/Contents/MacOS/KeyMouse"
cp Info.plist "$APP/Contents/Info.plist"
# Set SIGNING_IDENTITY to an Apple Development or Developer ID identity for stable TCC grants.
codesign --force --sign "${SIGNING_IDENTITY:--}" --identifier com.aman.keymouse "$APP"
print "Built $APP"
