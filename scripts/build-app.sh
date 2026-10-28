#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
SDK_PATH="$(xcrun --sdk macosx --show-sdk-path)"
SDK_VERSION="$(xcrun --sdk macosx --show-sdk-version)"
# Keep the deployment target in sync with Package.swift. Some toolchains otherwise
# record the deployment target as the SDK version, enabling legacy AppKit styling.
BUILD_ARGS=(-c release --sdk "$SDK_PATH"
  -Xlinker -platform_version -Xlinker macos -Xlinker 14.0 -Xlinker "$SDK_VERSION")
swift build "${BUILD_ARGS[@]}"
BIN_DIR="$(swift build "${BUILD_ARGS[@]}" --show-bin-path)"
RECORDED_SDK="$(xcrun vtool -show-build "$BIN_DIR/KeyMouse" | awk '$1 == "sdk" { print $2 }')"
if [[ "$RECORDED_SDK" != "$SDK_VERSION" ]]; then
  print -u2 "SDK mismatch: built with $SDK_VERSION, executable records $RECORDED_SDK"
  exit 1
fi
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
