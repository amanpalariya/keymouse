#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
./scripts/build-app.sh
APP="/Applications/Kbd Mouse.app"
if [[ -e "$APP" ]]; then
  BUNDLE_ID="$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' "$APP/Contents/Info.plist")"
  if [[ "$BUNDLE_ID" != com.aman.kbdmouse ]]; then
    print -u2 "Another app already exists at $APP"
    exit 1
  fi
fi
ditto "dist/Kbd Mouse.app" "$APP"
print "Installed $APP"
