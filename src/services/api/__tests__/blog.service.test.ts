import { describe, expect, it, vi } from "vitest";
import { BLOG_POSTS } from "@/constants/blog";
import { apiClient } from "@/lib/api-client";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getRelatedBlogPosts,
} from "../blog.service";

describe("blog service", () => {
  it("returns all published blog posts", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(BLOG_POSTS);
    const posts = await getAllBlogPosts();
    expect(posts.length).toBe(3);
    expect(posts[0].slug).toBe("secret-to-3x-valuation-customer-retention");
  });

  it("retrieves a blog post by valid slug", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(BLOG_POSTS[1]);
    const post = await getBlogPostBySlug("whatsapp-chaos-to-institutional-asset-3d-cards");
    expect(post).not.toBeNull();
    expect(post?.title).toContain("From WhatsApp DM Chaos");
    expect(post?.category).toBe("branding");
    expect(post?.takeaways.length).toBe(3);
  });

  it("returns null for non-existent slug", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(null);
    const post = await getBlogPostBySlug("non-existent-article-slug");
    expect(post).toBeNull();
  });

  it("filters posts by category correctly", async () => {
    const financePosts = BLOG_POSTS.filter(p => p.category === "finance");
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(financePosts);
    const result = await getBlogPostsByCategory("finance");
    expect(result.length).toBe(1);
    expect(result[0].slug).toBe("audit-ready-clean-invoicing-double-selling-price");

    vi.spyOn(apiClient, "get").mockResolvedValueOnce(BLOG_POSTS);
    const allPosts = await getBlogPostsByCategory("all");
    expect(allPosts.length).toBe(3);
  });

  it("retrieves related posts excluding current slug", async () => {
    const relatedPosts = BLOG_POSTS.slice(1, 3);
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(relatedPosts);
    const related = await getRelatedBlogPosts("secret-to-3x-valuation-customer-retention", 2);
    expect(related.length).toBe(2);
    expect(related.map(p => p.slug)).not.toContain("secret-to-3x-valuation-customer-retention");
  });
});
