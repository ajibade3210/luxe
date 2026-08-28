import { ArrowUpRight, CheckCircle2, Star } from "lucide-react";
import { GOOGLE_REVIEW_CONSTANTS } from "@/constants";
import type { StudioReviewsSectionProps } from "@/types";

export function StudioReviewsSection({
  reviews,
  averageRating = 5.0,
  totalReviews = 0,
  setReviewModalOpen,
  googleReviewsLink,
  primaryColor: _primaryColor,
  buttonColor: _buttonColor,
  textColor,
  radiusClass: _radiusClass,
}: StudioReviewsSectionProps) {
  const googleLink =
    googleReviewsLink ||
    `${GOOGLE_REVIEW_CONSTANTS.WRITE_REVIEW_BASE_URL}${GOOGLE_REVIEW_CONSTANTS.DEFAULT_PLACE_ID}`;

  const formattedRating =
    typeof averageRating === "number" ? averageRating.toFixed(1) : averageRating;
  const count = totalReviews > 0 ? totalReviews : reviews.length;

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              style={{ color: textColor }}
              className="font-serif text-2xl sm:text-3xl font-normal"
            >
              Reviews
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
              <CheckCircle2 size={11} className="text-[#10b981]" />
              Google Verified
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-1">
            <div className="flex text-[#eab308]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold text-[#1c1917]">{formattedRating}</span>
            <span>·</span>
            <span>
              {count} Verified Review{count === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href={googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#5c544d] hover:text-[#1c1917] bg-white hover:bg-[#faf6f0] px-4 py-2 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs"
          >
            <span>View on Google</span>
            <ArrowUpRight size={13} />
          </a>

          <a
            href={googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-button text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1.5"
            onClick={e => {
              if (!googleReviewsLink) {
                e.preventDefault();
                setReviewModalOpen(true);
              }
            }}
          >
            <span>Leave a Review</span>
            <Star size={12} className="text-[#eab308]" fill="currentColor" />
          </a>
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
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#a89e92]">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#47413b] italic leading-relaxed mb-6 font-serif">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#f4ece1]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f4ece1] text-[#855e2e] font-serif flex items-center justify-center text-xs font-bold shrink-0">
                  {rev.author ? rev.author[0] : "C"}
                </div>
                <div>
                  <strong className="text-xs text-[#1c1917] block font-medium">{rev.author}</strong>
                  {rev.role && <span className="text-[10px] text-[#8c827a] block">{rev.role}</span>}
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#059669] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#dcfce7]">
                <CheckCircle2 size={10} />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
