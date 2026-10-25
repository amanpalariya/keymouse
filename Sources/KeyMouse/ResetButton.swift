import SwiftUI

struct ResetButton: View {
  let title: String
  let action: () -> Void

  var body: some View {
    Button(title, role: .destructive, action: action)
      .buttonStyle(.borderedProminent).tint(.red).controlSize(.regular).font(.body)
      .frame(maxWidth: .infinity, alignment: .trailing)
  }
}
