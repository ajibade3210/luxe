import { apiClient } from "@/lib/api-client";
import type { BlogCategory, BlogPost } from "@/types";

/**
 * Returns all published blog articles.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const data = await apiClient.get<BlogPost[]>("/blog/posts");
  return Array.isArray(data) ? data : [];
}

/**
 * Returns a specific blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return apiClient.get<BlogPost>(`/blog/posts/${encodeURIComponent(slug)}`);
}

/**
 * Returns blog posts filtered by category.
 */
export async function getBlogPostsByCategory(category: BlogCategory | "all"): Promise<BlogPost[]> {
  const data = await apiClient.get<BlogPost[]>("/blog/posts", {
    category: category !== "all" ? category : undefined,
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Returns related blog posts excluding current slug.
 */
export async function getRelatedBlogPosts(currentSlug: string, limit = 2): Promise<BlogPost[]> {
  const data = await apiClient.get<BlogPost[]>(
    `/blog/posts/${encodeURIComponent(currentSlug)}/related`,
    { limit }
  );
  return Array.isArray(data) ? data : [];
}
