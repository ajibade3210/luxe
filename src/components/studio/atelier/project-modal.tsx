import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import type { ProjectModalProps } from "@/types";

export function ProjectModal({ project, onClose, onInquire, primaryColor }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#171716]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white border border-[#e5dcd1] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#78716c] hover:text-[#1c1917] p-2 bg-[#faf6f0] rounded-full cursor-pointer z-10"
          aria-label="Close project lightbox"
        >
          <X size={18} />
        </button>

        <div>
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.18em] font-semibold"
          >
            {project.category} · {project.location}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mt-1">
            {project.title}
          </h3>
        </div>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#faf6f0]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <p className="text-sm text-[#524b45] leading-relaxed">{project.description}</p>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            style={{ backgroundColor: primaryColor }}
            className="text-white text-xs font-medium px-6 py-3 rounded-full hover:opacity-95 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <span>Inquire about similar celebration</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
