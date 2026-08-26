import { Star } from "lucide-react";
import type { ReviewItem } from "@/lib/types";

interface StudioReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: string | number;
  totalReviews: number;
  setReviewModalOpen: (v: boolean) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export function StudioReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  setReviewModalOpen,
  primaryColor,
  buttonColor: _buttonColor,
  radiusClass: _radiusClass,
}: StudioReviewsSectionProps) {
  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#ebd8ca]">
        <div>
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold block"
          >
            Authenticated Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
            Words from our Couples & Patrons
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#eab308]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1c1917]">{averageRating} Rating</span>
            <span className="text-xs text-[#8c8278]">· {totalReviews} Verified Experiences</span>
          </div>
        </div>

        <button
          onClick={() => setReviewModalOpen(true)}
          className="outline-button text-xs py-2 px-4 self-start md:self-auto cursor-pointer"
        >
          Leave a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={rev.id || idx}
            className="bg-white border border-[#e8dfd3] rounded-3xl p-7 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-[#eab308]">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#a89e92]">{rev.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#47413b] italic leading-relaxed mb-6 font-serif">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#f0e8dc] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f4ece1] text-[#855e2e] font-serif flex items-center justify-center text-xs font-bold shrink-0">
                {rev.author ? rev.author[0] : "C"}
              </div>
              <div>
                <strong className="text-xs text-[#1c1917] block font-medium">{rev.author}</strong>
                <span className="text-[10px] text-[#8c8278]">
                  {rev.eventType} · Verified Patron
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
