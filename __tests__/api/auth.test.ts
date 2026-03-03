import { api } from "../../api/index";
import { login, getUser } from "../../api/auth";

jest.mock("../../api/index", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
  registerTokenGetter: jest.fn(),
}));

describe("api/auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("sends POST /api/login with username", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      await login("testuser");

      expect(api.post).toHaveBeenCalledWith("/api/login", {
        username: "testuser",
      });
    });

    it("propagates errors from the API", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(login("testuser")).rejects.toThrow("Network error");
    });
  });

  describe("getUser", () => {
    it("sends GET /api/auth/user and returns User data", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        username: "testuser",
        deuceCount: 42,
        subscription: "free",
      };
      (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

      const result = await getUser();

      expect(api.get).toHaveBeenCalledWith("/api/auth/user");
      expect(result).toEqual(mockUser);
    });

    it("propagates 401 errors", async () => {
      const error = new Error("Unauthorized");
      (error as any).response = { status: 401 };
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getUser()).rejects.toThrow("Unauthorized");
    });
  });
});
