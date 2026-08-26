import { ArrowRight, X } from "lucide-react";
import type { PortfolioProject } from "@/lib/types";

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onInquire: () => void;
  primaryColor: string;
}

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

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#faf6f0]">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <p className="text-sm text-[#524b45] leading-relaxed">{project.description}</p>

        <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-between text-xs text-[#78716c]">
          <span>
            <strong>Scope:</strong> {project.stats}
          </span>
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            style={{ color: primaryColor }}
            className="font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            Inquire about similar celebration <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
