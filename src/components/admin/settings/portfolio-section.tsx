import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { PortfolioProject } from "@/lib/types";
import { Card } from "./card";

interface PortfolioSectionProps {
  portfolio: PortfolioProject[];
  showAddProjectModal: boolean;
  setShowAddProjectModal: (v: boolean) => void;
  showManageGalleryModal: boolean;
  setShowManageGalleryModal: (v: boolean) => void;
  newProject: Partial<PortfolioProject>;
  setNewProject: React.Dispatch<React.SetStateAction<Partial<PortfolioProject>>>;
  isUploadingProjectImage: boolean;
  handleProjectImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddProject: (e: React.FormEvent) => void;
  removeProject: (id: string) => void;
  moveProject: (index: number, direction: "up" | "down") => void;
  draggedProjectIndex: number | null;
  dragOverProjectIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  onToast: (msg: string) => void;
}

export function PortfolioSection({
  portfolio,
  showAddProjectModal,
  setShowAddProjectModal,
  showManageGalleryModal,
  setShowManageGalleryModal,
  newProject,
  setNewProject,
  isUploadingProjectImage,
  handleProjectImageUpload,
  handleAddProject,
  removeProject,
  moveProject,
  draggedProjectIndex,
  dragOverProjectIndex,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  onToast,
}: PortfolioSectionProps) {
  return (
    <>
      <Card
        title="Portfolio showcase"
        description="High-resolution visuals that highlight your aesthetic standard and client transformations."
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3.5">
            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="dark-button text-xs py-2.5 px-4 rounded-xl flex-1 justify-center"
            >
              <Upload size={15} /> Upload new project
            </button>
            <button
              type="button"
              onClick={() => setShowManageGalleryModal(true)}
              className="outline-button text-xs py-2.5 px-4 rounded-xl flex-1 justify-center"
            >
              <ImagePlus size={15} /> Manage gallery ({portfolio.length})
            </button>
          </div>

          {/* Current Projects List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {portfolio.map(proj => (
              <div
                key={proj.id}
                className="border border-[#e5e7eb] rounded-xl p-3.5 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#d1d5db] transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#e5e7eb]"
                  />
                  <div className="truncate min-w-0">
                    <strong className="text-xs font-bold block text-[#111827] truncate">
                      {proj.title}
                    </strong>
                    <span className="text-[10px] text-[#6b7280] font-medium block mt-0.5">
                      {proj.category}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="text-[#9ca3af] hover:text-[#dc2626] p-1.5 rounded transition-colors cursor-pointer shrink-0"
                  title="Remove project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-lg max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProjectModal(false)}
              className="absolute right-4 top-4 text-[#6b7280] hover:text-[#191c1d] p-1"
            >
              <X size={18} />
            </button>
            <h3 className="font-sans text-xl text-[#191c1d] font-bold mb-1">
              Add New Showcase Project
            </h3>
            <p className="text-xs text-[#6b7280] mb-5">
              Upload images directly to the CDN to feature in your curated public gallery.
            </p>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1f2937] font-medium mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mirage Gala & Pavilion"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Wedding"
                    value={newProject.category}
                    onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Island, Lagos"
                    value={newProject.location}
                    onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1.5">
                  Project Cover Photo
                </label>
                {newProject.image ? (
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border border-[#e5e7eb] bg-[#f3f4f5] group aspect-[16/9] max-h-48 w-full flex items-center justify-center">
                      <img
                        src={newProject.image}
                        alt="Project Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white text-[#191c1d] hover:bg-[#f3f4f5] px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1.5 shadow-sm transition-colors">
                          {isUploadingProjectImage ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={12} /> Change Photo
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingProjectImage}
                            onChange={handleProjectImageUpload}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, image: "" })}
                          className="bg-[#ba1a1a] text-white hover:bg-[#93000a] px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded p-1.5 text-[11px]">
                      <span className="text-[#6b7280] font-medium shrink-0 pl-1">URL:</span>
                      <span className="font-mono text-[#191c1d] truncate flex-1 select-all">
                        {newProject.image}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard && newProject.image) {
                            navigator.clipboard.writeText(newProject.image);
                            onToast("Image URL copied to clipboard");
                          }
                        }}
                        className="shrink-0 text-[#6b7280] hover:text-[#0058be] p-1 cursor-pointer transition-colors"
                        title="Copy image URL"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block border-2 border-dashed border-[#e5e7eb] hover:border-[#0058be] bg-[#f8f9fa] hover:bg-[#f0f6ff]/30 rounded-lg p-6 text-center transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingProjectImage}
                      onChange={handleProjectImageUpload}
                    />
                    <div className="w-10 h-10 rounded-full bg-white border border-[#e5e7eb] group-hover:border-[#0058be] text-[#0058be] flex items-center justify-center mx-auto mb-2 shadow-2xs group-hover:scale-105 transition-all">
                      {isUploadingProjectImage ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                    </div>
                    <span className="block text-xs font-semibold text-[#191c1d] group-hover:text-[#0058be] transition-colors">
                      {isUploadingProjectImage
                        ? "Uploading to CDN..."
                        : "Click to upload project cover picture"}
                    </span>
                    <span className="block text-[11px] text-[#6b7280] mt-0.5">
                      PNG, JPG, or WebP (max 10MB) · Hosted on CDN
                    </span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Project Narrative / Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="A brief editorial summary of this project..."
                  value={newProject.description}
                  onChange={e =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded p-3 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="outline-button flex-1 py-2.5 text-xs font-medium justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dark-button flex-1 py-2.5 text-xs font-medium justify-center"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Gallery Arrangement Modal */}
      {showManageGalleryModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border border-[#e5e7eb] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-[#e5e7eb]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#0058be] font-semibold">
                  Gallery Showcase · {portfolio.length} Projects
                </span>
                <h3 className="font-sans text-2xl text-[#191c1d] font-bold mt-0.5">
                  Manage Gallery Arrangement
                </h3>
                <p className="text-xs text-[#6b7280] mt-1">
                  Drag items or use the arrows to reorder how projects appear in &quot;Our Best
                  Work&quot; on your public site.
                </p>
              </div>
              <button
                onClick={() => setShowManageGalleryModal(false)}
                className="text-[#6b7280] hover:text-[#191c1d] p-1.5 rounded-md hover:bg-[#f3f4f5] cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
              {portfolio.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#e5e7eb] rounded-lg">
                  <ImagePlus size={32} className="mx-auto text-[#9ca3af] mb-2" />
                  <p className="text-sm font-medium text-[#191c1d]">No gallery projects yet</p>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Upload your first showcase project to get started.
                  </p>
                </div>
              ) : (
                portfolio.map((proj, idx) => {
                  const isDragging = draggedProjectIndex === idx;
                  const isDragOver = dragOverProjectIndex === idx && draggedProjectIndex !== idx;
                  return (
                    <div
                      key={proj.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isDragging
                          ? "opacity-40 bg-[#f3f4f5] border-dashed border-[#0058be]"
                          : isDragOver
                            ? "border-[#0058be] bg-[#f0f6ff]/40 shadow-sm"
                            : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:shadow-2xs"
                      }`}
                    >
                      <div className="cursor-grab active:cursor-grabbing text-[#9ca3af] hover:text-[#191c1d] p-1">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-6 text-center text-xs font-mono font-semibold text-[#6b7280]">
                        #{idx + 1}
                      </div>
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[#f3f4f5] border border-[#e5e7eb] shrink-0">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#0058be] text-white text-[8px] font-bold uppercase tracking-wider text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#191c1d] truncate">{proj.title}</h4>
                        <p className="text-[11px] text-[#6b7280] truncate">
                          {proj.category} · {proj.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveProject(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-[#f3f4f5] text-[#6b7280] hover:text-[#191c1d] disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProject(idx, "down")}
                          disabled={idx === portfolio.length - 1}
                          className="p-1.5 rounded hover:bg-[#f3f4f5] text-[#6b7280] hover:text-[#191c1d] disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProject(proj.id)}
                          className="p-1.5 rounded hover:bg-[#fee2e2] text-[#9ca3af] hover:text-[#dc2626]"
                          title="Delete from gallery"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
              <span className="text-xs text-[#6b7280]">
                Changes apply immediately to your live studio.
              </span>
              <button
                type="button"
                onClick={() => setShowManageGalleryModal(false)}
                className="dark-button text-xs py-2 px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
