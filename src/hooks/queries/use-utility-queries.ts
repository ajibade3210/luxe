"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getRelatedBlogPosts,
} from "@/services/api/blog.service";
import { getBroadcastHistory, sendBroadcast } from "@/services/api/broadcast.service";
import { getFeatureRequests, submitFeatureRequest } from "@/services/api/feedback.service";
import type { BlogCategory, BroadcastPayload, CreateFeatureRequestInput } from "@/types";

// Broadcasts
export function useBroadcastHistoryQuery() {
  return useQuery({
    queryKey: queryKeys.broadcasts.history(),
    queryFn: () => getBroadcastHistory(),
  });
}

export function useSendBroadcastMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BroadcastPayload) => sendBroadcast(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.broadcasts.all });
    },
  });
}

// Feedback / Feature Requests
export function useFeatureRequestsQuery() {
  return useQuery({
    queryKey: queryKeys.feedback.list(),
    queryFn: () => getFeatureRequests(),
  });
}

export function useSubmitFeatureRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFeatureRequestInput) => submitFeatureRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.all });
    },
  });
}

// Blog
export function useBlogPostsQuery(category?: BlogCategory | "all") {
  return useQuery({
    queryKey: queryKeys.blog.list(category),
    queryFn: () =>
      category && category !== "all" ? getBlogPostsByCategory(category) : getAllBlogPosts(),
  });
}

export function useBlogPostQuery(slug: string | null | undefined) {
  return useQuery({
    queryKey: slug ? queryKeys.blog.detail(slug) : ["blog", "detail", "empty"],
    queryFn: () => {
      if (!slug) return null;
      return getBlogPostBySlug(slug);
    },
    enabled: Boolean(slug),
  });
}

export function useRelatedBlogPostsQuery(currentSlug: string, limit = 2) {
  return useQuery({
    queryKey: queryKeys.blog.related(currentSlug, limit),
    queryFn: () => getRelatedBlogPosts(currentSlug, limit),
    enabled: Boolean(currentSlug),
  });
}
