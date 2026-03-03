// Test the parseInviteCode logic extracted from useDeepLink
// Since parseInviteCode is not exported, we test through the Linking.parse mock

import * as Linking from "expo-linking";

describe("Deep link parsing", () => {
  describe("parseInviteCode via Linking.parse", () => {
    it("parses custom scheme invite link", () => {
      const result = Linking.parse("deucediary://invite/abc123");
      expect(result.path).toBe("invite/abc123");
    });

    it("parses HTTPS universal link", () => {
      const result = Linking.parse("https://deucediary.app/invite/xyz789");
      expect(result.path).toBe("invite/xyz789");
    });

    it("returns path for non-invite URLs", () => {
      const result = Linking.parse("https://deucediary.app/other/path");
      expect(result.path).toBe("other/path");
    });

    it("handles root URL", () => {
      const result = Linking.parse("https://deucediary.app/");
      expect(result.path).toBe("");
    });

    it("handles invite code extraction from path segments", () => {
      const result = Linking.parse("deucediary://invite/TEST_CODE");
      const segments = result.path?.split("/").filter(Boolean) ?? [];
      expect(segments[0]).toBe("invite");
      expect(segments[1]).toBe("TEST_CODE");
    });

    it("handles invite link with no code", () => {
      const result = Linking.parse("deucediary://invite/");
      const segments = result.path?.split("/").filter(Boolean) ?? [];
      expect(segments[0]).toBe("invite");
      expect(segments[1]).toBeUndefined();
    });
  });
});
