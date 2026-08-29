import { BLOG_POSTS } from "@/constants";
import type { BlogCategory, BlogPost } from "@/types";

const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Returns all published blog articles.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await delay(20);
  return [...BLOG_POSTS];
}

/**
 * Returns a specific blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await delay(20);
  const found = BLOG_POSTS.find(post => post.slug === slug);
  return found ? { ...found } : null;
}

/**
 * Returns blog posts filtered by category.
 */
export async function getBlogPostsByCategory(category: BlogCategory | "all"): Promise<BlogPost[]> {
  await delay(20);
  if (category === "all") {
    return [...BLOG_POSTS];
  }
  return BLOG_POSTS.filter(post => post.category === category);
}

/**
 * Returns related blog posts excluding current slug.
 */
export async function getRelatedBlogPosts(currentSlug: string, limit = 2): Promise<BlogPost[]> {
  await delay(20);
  return BLOG_POSTS.filter(post => post.slug !== currentSlug).slice(0, limit);
}
