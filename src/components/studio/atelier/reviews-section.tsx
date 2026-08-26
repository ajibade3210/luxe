import { ArrowUpRight, Star } from "lucide-react";
import type { ReviewItem } from "@/lib/types";

interface StudioReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: string | number;
  totalReviews: number;
  setReviewModalOpen: (v: boolean) => void;
  googleReviewsLink?: string;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export function StudioReviewsSection({
  reviews,
  averageRating: _averageRating,
  totalReviews: _totalReviews,
  setReviewModalOpen,
  googleReviewsLink,
  primaryColor: _primaryColor,
  buttonColor: _buttonColor,
  radiusClass: _radiusClass,
}: StudioReviewsSectionProps) {
  const googleLink = googleReviewsLink || "https://www.google.com/search?q=Elan+Events+reviews";

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">Reviews</h2>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href={googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#5c544d] hover:text-[#1c1917] bg-white hover:bg-[#faf6f0] px-4 py-2 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs"
          >
            <span>View More Reviews</span>
            <ArrowUpRight size={13} />
          </a>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="outline-button text-xs py-2 px-4 cursor-pointer"
          >
            Leave a Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((rev, idx) => (
          <div
            key={rev.id || idx}
            className="bg-white border border-[#e8dfd3] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
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

            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f4ece1] text-[#855e2e] font-serif flex items-center justify-center text-xs font-bold shrink-0">
                {rev.author ? rev.author[0] : "C"}
              </div>
              <strong className="text-xs text-[#1c1917] block font-medium">{rev.author}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
