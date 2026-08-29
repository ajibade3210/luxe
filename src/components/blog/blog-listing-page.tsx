"use client";

import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/constants/blog";
import { BlogGraphicCard } from "./blog-graphics";

export function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts =
    selectedCategory === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-[#1f1d1a]">
      {/* Top Header Navigation */}
      <header className="border-b border-[#eee7dc] bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#665e57] hover:text-[#1f1d1a] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </a>
            <span className="text-[#ded5c8] hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#8c827a]">
              <span>Resources</span>
              <span>/</span>
              <span className="text-[#1f1d1a] font-bold">Blog</span>
            </div>
          </div>

          <BrandLogo className="public-logo" />

          <div className="flex items-center gap-3">
            <a
              href="/valuation-calculator"
              className="text-xs font-semibold text-[#9e633d] hover:underline hidden sm:inline"
            >
              Valuation Calculator
            </a>
            <a
              href="/signup"
              className="bg-[#191c1d] hover:bg-black !text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#faf7f2] text-[#9e633d] border border-[#ded5c8]">
            <span>Illustrated Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1f1d1a] tracking-tight leading-tight">
            Visual Insights for High-Growth Vendors & Ateliers
          </h1>
          <p className="text-sm sm:text-base text-[#665e57] leading-relaxed">
            Graphic breakdowns on customer retention, digital brand equity, and audit-ready
            financial architecture to maximize your business value.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#191c1d] text-white shadow-xs"
                    : "bg-white border border-[#eee7dc] text-[#524a43] hover:border-[#c59a78]"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.slug}
              className="bg-white border border-[#eee7dc] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(70,50,30,0.02)] hover:border-[#c59a78]/70 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cartoon Graphic Hero Thumbnail */}
                <div className="border-b border-[#f4eee6] overflow-hidden bg-[#faf7f2]">
                  <BlogGraphicCard
                    type={post.coverGraphic}
                    className="border-none rounded-none p-4 scale-95 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>

                {/* Article Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#8c827a]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] bg-[#faf7f2] border border-[#ded5c8] text-[#9e633d]">
                      {post.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-[#1f1d1a] group-hover:text-[#9e633d] transition-colors leading-snug">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h2>

                  <p className="text-xs text-[#665e57] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 border-t border-[#f4eee6] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1f1d1a] text-[#c59a78] text-[10px] font-bold flex items-center justify-center">
                      {post.author.avatarText}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-[#1f1d1a] block">{post.author.name}</span>
                      <span className="text-[#8c827a] block text-[10px]">{post.author.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="w-full bg-[#faf7f2] hover:bg-[#191c1d] hover:text-white text-[#1f1d1a] border border-[#e8dfd2] hover:border-[#191c1d] py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Read Illustrated Guide</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Featured Valuation Tool Box */}
        <section className="bg-gradient-to-br from-[#faf7f2] to-[#f4eee6] border border-[#e8dfd2] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="text-2xl font-serif font-bold text-[#1f1d1a]">
              Want to see what your business is worth right now?
            </h3>
          </div>
          <a
            href="/valuation-calculator"
            className="bg-[#191c1d] hover:bg-black !text-white px-6 py-3.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <span>Launch Free Valuation Calculator</span>
            <ArrowRight size={14} />
          </a>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
