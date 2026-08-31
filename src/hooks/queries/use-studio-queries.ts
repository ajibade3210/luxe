"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FEATURED_ORGANIZATIONS } from "@/constants/landing";
import { queryKeys } from "@/lib/query-keys";
import {
  checkSlugAvailability,
  connectSocialChannel,
  disconnectSocialChannel,
  getBusinessBySlug,
  getBusinessProfile,
  getFeaturedOrganizations,
  publishChanges,
  submitReview,
  updateBusinessProfile,
} from "@/services/api/profile.service";
import type { BusinessProfile, ReviewItem } from "@/types";

export function useStudioProfileQuery() {
  return useQuery({
    queryKey: queryKeys.studios.me(),
    queryFn: () => getBusinessProfile(),
  });
}

export function useFeaturedStudiosQuery() {
  return useQuery({
    queryKey: queryKeys.studios.featured(),
    queryFn: () => getFeaturedOrganizations(),
    placeholderData: () => Array.from(FEATURED_ORGANIZATIONS),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudioBySlugQuery(slug: string | null | undefined) {
  return useQuery({
    queryKey: slug ? queryKeys.studios.bySlug(slug) : ["studios", "slug", "empty"],
    queryFn: () => {
      if (!slug) return null;
      return getBusinessBySlug(slug);
    },
    enabled: Boolean(slug),
  });
}

export function useCheckSlugAvailabilityQuery(slug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.studios.slugCheck(slug),
    queryFn: () => checkSlugAvailability(slug),
    enabled: Boolean(slug && slug.length >= 3 && enabled),
  });
}

export function useUpdateStudioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<BusinessProfile>) => updateBusinessProfile(input),
    onSuccess: updated => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
      if (updated?.slug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.studios.bySlug(updated.slug) });
      }
    },
  });
}

export function usePublishStudioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => publishChanges(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
    },
  });
}

export function useConnectSocialChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => connectSocialChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
    },
  });
}

export function useDisconnectSocialChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disconnectSocialChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
    },
  });
}

export function useSubmitReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<ReviewItem, "id" | "date"> & { studioSlug?: string }) =>
      submitReview(input),
    onSuccess: (_, { studioSlug }) => {
      if (studioSlug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.studios.bySlug(studioSlug) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
    },
  });
}
