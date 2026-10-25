// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "KbdMouse",
  platforms: [.macOS(.v14)],
  products: [.executable(name: "KbdMouse", targets: ["KbdMouse"])],
  targets: [
    .executableTarget(name: "KbdMouse"),
    .testTarget(name: "KbdMouseTests", dependencies: ["KbdMouse"]),
  ],
  swiftLanguageModes: [.v5]
)
