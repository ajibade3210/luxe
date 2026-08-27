"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { featuredOrganizations } from "@/lib/mock-data";
import type { HeroRotatingCardProps } from "@/types";

export function HeroRotatingCard({
  organizations = featuredOrganizations,
  intervalMs = 6000, // 6 seconds per rotation
}: HeroRotatingCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const orgs = organizations && organizations.length > 0 ? organizations : featuredOrganizations;
  const currentOrg = orgs[currentIndex] || orgs[0];

  // Function to switch to next organization with smooth transition
  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % orgs.length);
      setIsAnimating(false);
    }, 280);
  }, [orgs.length]);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + orgs.length) % orgs.length);
      setIsAnimating(false);
    }, 280);
  }, [orgs.length]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (idx === currentIndex) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(idx);
        setIsAnimating(false);
      }, 280);
    },
    [currentIndex]
  );

  // Auto rotation timer with pause on hover
  useEffect(() => {
    if (isPaused || orgs.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, intervalMs, orgs.length, handleNext]);

  return (
    <div
      className="hero-card-container relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <a
        href={`/${currentOrg.slug}`}
        className="profile-card group transition-all duration-500 hover:-translate-y-1 block text-decoration-none relative overflow-hidden"
        aria-label={`View live profile for ${currentOrg.name}`}
      >
        {/* Top Floating Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#e8dfd3] shadow-xs text-[10px] font-medium text-[#191c1d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#855e2e] animate-pulse" />
          <span>Spotlight</span>
        </div>

        {/* Dynamic Studio Logo / Imagery */}
        <div
          className={`profile-image transition-all duration-300 relative overflow-hidden flex items-center justify-center bg-[#d7d4c9] ${
            isAnimating ? "opacity-30 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={currentOrg.logoUrl}
            alt={`${currentOrg.name} logo`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Dynamic Studio Meta */}
        <div
          className={`profile-meta transition-all duration-300 ${
            isAnimating ? "opacity-30 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <span className="eyebrow">{currentOrg.eyebrow}</span>
          <h2 className="group-hover:text-[#0058be] transition-colors">{currentOrg.name}</h2>
          <p className="line-clamp-2">{currentOrg.tagline}</p>
        </div>

        {/* Card Footer with Custom Domain & CTA */}
        <div className="profile-foot">
          <span>{currentOrg.badge}</span>
          <span className="text-[#0058be] font-medium group-hover:translate-x-0.5 transition-transform">
            View live profile <ArrowRight size={14} />
          </span>
        </div>
      </a>

      {/* Floating Studio Switch Controls & Indicators */}
      <div className="hero-card-controls flex items-center justify-between mt-3 px-2">
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {orgs.map((org, idx) => (
            <button
              key={org.id}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-5 bg-[#191c1d]" : "w-1.5 bg-[#dcd6cb] hover:bg-[#a8a196]"
              }`}
              aria-label={`Switch to ${org.name}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#5c5f60] hover:text-[#191c1d] hover:bg-black/5 transition-colors"
            aria-label="Previous organization"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#5c5f60] hover:text-[#191c1d] hover:bg-black/5 transition-colors"
            aria-label="Next organization"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
