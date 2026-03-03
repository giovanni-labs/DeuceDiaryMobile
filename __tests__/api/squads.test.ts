import { api } from "../../api/index";
import {
  listSquads,
  joinSquad,
  createSquad,
  getSquadDetail,
  getGroupStreak,
  createInvite,
  getGroupPreview,
  getGroupLeaderboard,
} from "../../api/squads";

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

const mockSquad = {
  id: "s1",
  name: "Test Squad",
  description: "A test squad",
  createdBy: "u1",
  memberCount: 3,
  entryCount: 10,
};

describe("api/squads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listSquads", () => {
    it("fetches from GET /api/groups", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [mockSquad] });

      const result = await listSquads();

      expect(api.get).toHaveBeenCalledWith("/api/groups");
      expect(result).toEqual([mockSquad]);
    });
  });

  describe("joinSquad", () => {
    it("posts to POST /api/join/:inviteId", async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { group: mockSquad, message: "Joined!" },
      });

      const result = await joinSquad("invite123");

      expect(api.post).toHaveBeenCalledWith("/api/join/invite123");
      expect(result.group).toEqual(mockSquad);
    });
  });

  describe("createSquad", () => {
    it("posts to POST /api/groups with name and description", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: mockSquad });

      const result = await createSquad({ name: "New Squad", description: "Cool squad" });

      expect(api.post).toHaveBeenCalledWith("/api/groups", {
        name: "New Squad",
        description: "Cool squad",
      });
      expect(result).toEqual(mockSquad);
    });

    it("creates squad with only a name", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: mockSquad });

      await createSquad({ name: "Minimal Squad" });

      expect(api.post).toHaveBeenCalledWith("/api/groups", {
        name: "Minimal Squad",
      });
    });
  });

  describe("getSquadDetail", () => {
    it("fetches from GET /api/groups/:squadId", async () => {
      const detail = { group: mockSquad, members: [], entries: [] };
      (api.get as jest.Mock).mockResolvedValue({ data: detail });

      const result = await getSquadDetail("s1");

      expect(api.get).toHaveBeenCalledWith("/api/groups/s1");
      expect(result).toEqual(detail);
    });
  });

  describe("getGroupStreak", () => {
    it("fetches from GET /api/groups/:groupId/streak", async () => {
      const streak = { currentStreak: 5, longestStreak: 10, memberCount: 3, logsToday: [] };
      (api.get as jest.Mock).mockResolvedValue({ data: streak });

      const result = await getGroupStreak("s1");

      expect(api.get).toHaveBeenCalledWith("/api/groups/s1/streak");
      expect(result.currentStreak).toBe(5);
    });
  });

  describe("createInvite", () => {
    it("posts to POST /api/groups/:groupId/invite", async () => {
      const invite = { inviteLink: "https://deucediary.app/invite/abc", id: "inv1" };
      (api.post as jest.Mock).mockResolvedValue({ data: invite });

      const result = await createInvite("s1");

      expect(api.post).toHaveBeenCalledWith("/api/groups/s1/invite");
      expect(result.inviteLink).toContain("invite");
    });
  });

  describe("getGroupPreview", () => {
    it("fetches from GET /api/groups/preview/:code", async () => {
      const preview = { name: "Cool Squad", memberCount: 5, description: null };
      (api.get as jest.Mock).mockResolvedValue({ data: preview });

      const result = await getGroupPreview("abc123");

      expect(api.get).toHaveBeenCalledWith("/api/groups/preview/abc123");
      expect(result.name).toBe("Cool Squad");
    });
  });

  describe("getGroupLeaderboard", () => {
    it("fetches from GET /api/groups/:groupId/leaderboard", async () => {
      const entries = [
        { userId: "u1", username: "leader", deuceCount: 50 },
        { userId: "u2", username: "second", deuceCount: 30 },
      ];
      (api.get as jest.Mock).mockResolvedValue({ data: entries });

      const result = await getGroupLeaderboard("s1");

      expect(api.get).toHaveBeenCalledWith("/api/groups/s1/leaderboard");
      expect(result).toHaveLength(2);
      expect(result[0].deuceCount).toBe(50);
    });
  });
});
