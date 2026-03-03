import { api } from "../../api/index";
import {
  getGlobalFeed,
  getFeed,
  postDeuce,
  addReaction,
  removeReaction,
  getReactions,
  getGroupFeed,
} from "../../api/deuces";

jest.mock("../../api/index", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
  registerTokenGetter: jest.fn(),
}));

const mockDeuce = {
  id: "d1",
  userId: "u1",
  groupId: "g1",
  location: "Home",
  thoughts: "Nice",
  loggedAt: "2026-03-03T10:00:00Z",
  createdAt: "2026-03-03T10:00:00Z",
};

describe("api/deuces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGlobalFeed", () => {
    it("fetches from GET /api/deuces", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [mockDeuce] });

      const result = await getGlobalFeed();

      expect(api.get).toHaveBeenCalledWith("/api/deuces");
      expect(result).toEqual([mockDeuce]);
    });

    it("returns empty array when API returns empty", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await getGlobalFeed();
      expect(result).toEqual([]);
    });
  });

  describe("getFeed", () => {
    it("fetches group entries from GET /api/groups/:groupId", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { group: {}, members: [], entries: [mockDeuce] },
      });

      const result = await getFeed("g1");

      expect(api.get).toHaveBeenCalledWith("/api/groups/g1");
      expect(result).toEqual([mockDeuce]);
    });
  });

  describe("postDeuce", () => {
    it("posts to POST /api/deuces with payload", async () => {
      const payload = {
        groupIds: ["g1"],
        location: "Office",
        thoughts: "Quick one",
      };
      (api.post as jest.Mock).mockResolvedValue({
        data: { entries: [mockDeuce], count: 1 },
      });

      const result = await postDeuce(payload);

      expect(api.post).toHaveBeenCalledWith("/api/deuces", payload);
      expect(result).toEqual({ entries: [mockDeuce], count: 1 });
    });

    it("sends optional loggedAt timestamp", async () => {
      const payload = {
        groupIds: [],
        location: "",
        thoughts: "",
        loggedAt: "2026-03-03T09:00:00Z",
      };
      (api.post as jest.Mock).mockResolvedValue({
        data: { entries: [], count: 0 },
      });

      await postDeuce(payload);

      expect(api.post).toHaveBeenCalledWith("/api/deuces", payload);
    });
  });

  describe("addReaction", () => {
    it("posts reaction to an entry", async () => {
      const mockReaction = { id: 1, entryId: "d1", userId: "u1", emoji: "🔥" };
      (api.post as jest.Mock).mockResolvedValue({ data: mockReaction });

      const result = await addReaction("d1", "🔥");

      expect(api.post).toHaveBeenCalledWith("/api/entries/d1/reactions", {
        emoji: "🔥",
      });
      expect(result).toEqual(mockReaction);
    });
  });

  describe("removeReaction", () => {
    it("deletes reaction from an entry", async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      await removeReaction("d1", "💩");

      expect(api.delete).toHaveBeenCalledWith("/api/entries/d1/reactions", {
        data: { emoji: "💩" },
      });
    });
  });

  describe("getReactions", () => {
    it("fetches reactions for an entry", async () => {
      const reactions = [
        { id: 1, entryId: "d1", emoji: "🔥" },
        { id: 2, entryId: "d1", emoji: "💩" },
      ];
      (api.get as jest.Mock).mockResolvedValue({ data: reactions });

      const result = await getReactions("d1");

      expect(api.get).toHaveBeenCalledWith("/api/entries/d1/reactions");
      expect(result).toHaveLength(2);
    });
  });

  describe("getGroupFeed", () => {
    it("fetches filtered feed with groupId param", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [mockDeuce] });

      const result = await getGroupFeed("g1");

      expect(api.get).toHaveBeenCalledWith("/api/deuces", {
        params: { groupId: "g1" },
      });
      expect(result).toEqual([mockDeuce]);
    });
  });
});
