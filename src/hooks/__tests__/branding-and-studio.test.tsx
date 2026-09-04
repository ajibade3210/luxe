/** @vitest-environment jsdom */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSession } from "@/lib/api";
import { apiClient } from "@/lib/api-client";
import { useBrandingSettings } from "../settings/use-branding-settings";
import { useCurrentStudio } from "../use-current-studio";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function TestQueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("Branding and Studio Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    localStorage.clear();
    queryClient = createTestQueryClient();
    vi.restoreAllMocks();
  });

  describe("useBrandingSettings", () => {
    it("recognizes no-op slug without API call and sets available", async () => {
      const getSpy = vi.spyOn(apiClient, "get");
      const { result } = renderHook(() => useBrandingSettings());

      act(() => {
        result.current.setInitialSlug("elan-stores");
        result.current.setSlug("elan-stores");
      });

      expect(result.current.slugStatus).toBe("available");
      expect(getSpy).not.toHaveBeenCalled();
    });

    it("marks slug < 3 characters as taken/invalid", async () => {
      const { result } = renderHook(() => useBrandingSettings());

      act(() => {
        result.current.setInitialSlug("elan-stores");
        result.current.setSlug("ab");
      });

      expect(result.current.slugStatus).toBe("taken");
    });

    it("debounces checkSlugAvailability for new slugs", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ available: true, slug: "new-brand" });

      const { result } = renderHook(() => useBrandingSettings());

      act(() => {
        result.current.setInitialSlug("elan-stores");
        result.current.setSlug("new-brand");
      });

      expect(result.current.slugStatus).toBe("checking");

      await waitFor(() => expect(result.current.slugStatus).toBe("available"), {
        timeout: 1000,
      });
    });
  });

  describe("useCurrentStudio", () => {
    it("reactively updates slug when CUSTOM_EVENTS.authChanged is dispatched", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValue({
        id: "studio-1",
        slug: "initial-slug",
        businessName: "Initial Atelier",
        services: [],
      });

      const { result } = renderHook(() => useCurrentStudio(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.slug).toBe("initial-slug"));

      act(() => {
        createSession({
          id: "studio-1",
          studioSlug: "updated-luxury-slug",
          studioName: "Updated Atelier",
        });
      });

      await waitFor(() => {
        expect(result.current.slug).toBe("updated-luxury-slug");
        expect(result.current.studioName).toBe("Updated Atelier");
      });
    });
  });
});
