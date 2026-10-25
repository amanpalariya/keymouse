// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "KeyMouse",
  platforms: [.macOS(.v14)],
  products: [.executable(name: "KeyMouse", targets: ["KeyMouse"])],
  targets: [
    .executableTarget(name: "KeyMouse", resources: [.process("Resources")]),
    .testTarget(name: "KeyMouseTests", dependencies: ["KeyMouse"]),
  ],
  swiftLanguageModes: [.v5]
)
