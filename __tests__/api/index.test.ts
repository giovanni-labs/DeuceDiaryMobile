import { api, registerTokenGetter } from "../../api/index";

// We test the actual module (not mocked) for the interceptor logic
// But we need to mock the axios create call setup

describe("api/index", () => {
  describe("api instance", () => {
    it("exports an axios instance", () => {
      expect(api).toBeDefined();
      expect(api.get).toBeDefined();
      expect(api.post).toBeDefined();
    });

    it("has JSON content type header", () => {
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });

    it("has withCredentials enabled for session cookies", () => {
      expect(api.defaults.withCredentials).toBe(true);
    });

    it("uses the default base URL when env var is not set", () => {
      // In test env, EXPO_PUBLIC_API_URL is not set
      expect(api.defaults.baseURL).toBeDefined();
    });
  });

  describe("registerTokenGetter", () => {
    it("is a function", () => {
      expect(typeof registerTokenGetter).toBe("function");
    });

    it("accepts a function or null", () => {
      expect(() => registerTokenGetter(() => Promise.resolve("token"))).not.toThrow();
      expect(() => registerTokenGetter(null)).not.toThrow();
    });
  });
});
