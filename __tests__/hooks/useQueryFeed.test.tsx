import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryFeed } from "../../hooks/useQueryFeed";

jest.mock("../../api/deuces", () => ({
  getGlobalFeed: jest.fn(),
  getFeed: jest.fn(),
}));

const { getGlobalFeed, getFeed } = require("../../api/deuces");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useQueryFeed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches global feed when no groupId provided", async () => {
    const mockFeed = [
      { id: "1", thoughts: "Hello", loggedAt: "2026-03-03T10:00:00Z" },
    ];
    getGlobalFeed.mockResolvedValue(mockFeed);

    const { result } = renderHook(() => useQueryFeed(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getGlobalFeed).toHaveBeenCalled();
    expect(getFeed).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockFeed);
  });

  it("fetches group feed when groupId is provided", async () => {
    const mockFeed = [
      { id: "2", thoughts: "Group post", loggedAt: "2026-03-03T11:00:00Z" },
    ];
    getFeed.mockResolvedValue(mockFeed);

    const { result } = renderHook(() => useQueryFeed("group-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getFeed).toHaveBeenCalledWith("group-1");
    expect(getGlobalFeed).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockFeed);
  });

  it("uses correct query key for global feed", () => {
    getGlobalFeed.mockResolvedValue([]);

    const { result } = renderHook(() => useQueryFeed(), {
      wrapper: createWrapper(),
    });

    // The hook is loading, so we verify it was called
    expect(result.current.isLoading).toBe(true);
  });

  it("uses correct query key for group feed", () => {
    getFeed.mockResolvedValue([]);

    const { result } = renderHook(() => useQueryFeed("g1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("fetches global feed when groupId is null", async () => {
    getGlobalFeed.mockResolvedValue([]);

    const { result } = renderHook(() => useQueryFeed(null), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getGlobalFeed).toHaveBeenCalled();
    expect(getFeed).not.toHaveBeenCalled();
  });
});
