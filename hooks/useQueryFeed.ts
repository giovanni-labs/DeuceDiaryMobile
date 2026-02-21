import { useQuery } from "@tanstack/react-query";
import { getGlobalFeed, getFeed } from "../api/deuces";
import type { Deuce } from "../types/api.types";

/**
 * TanStack Query hook for fetching the deuce feed.
 * Without a groupId, fetches the global feed from GET /api/deuces.
 * With a groupId, fetches that group's entries.
 */
export function useQueryFeed(groupId?: string | null) {
  return useQuery<Deuce[]>({
    queryKey: groupId ? ["feed", groupId] : ["feed", "global"],
    queryFn: () => (groupId ? getFeed(groupId) : getGlobalFeed()),
    staleTime: 1000 * 30,
  });
}
