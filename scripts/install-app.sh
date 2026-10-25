#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
./scripts/build-app.sh
APP="/Applications/Key Mouse.app"
if [[ -e "$APP" ]]; then
  BUNDLE_ID="$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' "$APP/Contents/Info.plist")"
  if [[ "$BUNDLE_ID" != com.aman.keymouse ]]; then
    print -u2 "Another app already exists at $APP"
    exit 1
  fi
fi
ditto "dist/Key Mouse.app" "$APP"
print "Installed $APP"
