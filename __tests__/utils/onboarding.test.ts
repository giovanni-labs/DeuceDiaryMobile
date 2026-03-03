import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  completeOnboarding,
  hasCompletedOnboarding,
} from "../../app/onboarding/index";

describe("onboarding helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("completeOnboarding", () => {
    it("sets onboarding key to 'true' in AsyncStorage", async () => {
      await completeOnboarding();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "deucediary_onboarding_complete",
        "true"
      );
    });
  });

  describe("hasCompletedOnboarding", () => {
    it("returns false when key is not set", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await hasCompletedOnboarding();

      expect(result).toBe(false);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "deucediary_onboarding_complete"
      );
    });

    it("returns true when key is 'true'", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("true");

      const result = await hasCompletedOnboarding();

      expect(result).toBe(true);
    });

    it("returns false for other values", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("false");

      const result = await hasCompletedOnboarding();

      expect(result).toBe(false);
    });
  });
});
