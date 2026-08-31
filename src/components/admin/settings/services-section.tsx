import { Edit3, Plus, Trash2 } from "lucide-react";
import { MAX_SERVICE_NAME_LENGTH, MAX_SERVICES } from "@/constants";
import type { ServicesSectionProps } from "@/types";
import { Card } from "./card";
import { CategoryDropdown } from "./category-dropdown";
import { Toggle } from "./toggle";

export function ServicesSection({
  services,
  showServices,
  setShowServices,
  editingServiceId,
  setEditingServiceId,
  updateService,
  removeService,
  showAddService,
  setShowAddService,
  newServiceInput,
  setNewServiceInput,
  newServiceCategory,
  setNewServiceCategory,
  newServiceDesc,
  setNewServiceDesc,
  addService,
  categories,
  addCategory,
  removeCategory,
}: ServicesSectionProps) {
  return (
    <Card
      title={`Services & offerings (${services.length}/${MAX_SERVICES})`}
      description="Make your expertise easy to understand for prospective clients."
      action={
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6b7280]">Show on page</span>
          <Toggle
            on={showServices}
            onClick={() => setShowServices(!showServices)}
            ariaLabel="Toggle services section visibility"
          />
        </div>
      }
    >
      <div className="space-y-3.5">
        {!showServices && (
          <div className="bg-[#fef3c7] text-[#92400e] text-xs px-3 py-2 rounded-lg border border-[#fde68a]">
            This section is currently hidden on your public studio page.
          </div>
        )}
        {/* Compact 2-Column Grid of Service Offerings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {services.map((service, _i) => {
            const isEditing = editingServiceId === service.id;

            if (isEditing) {
              return (
                <div
                  key={service.id ?? service.name ?? _i}
                  className="col-span-full border border-[#0058be]/30 bg-[#f0f6ff]/30 rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0058be]">Edit Service</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
                        Service Name (max {MAX_SERVICE_NAME_LENGTH} chars)
                      </label>
                      <input
                        value={service.name}
                        maxLength={MAX_SERVICE_NAME_LENGTH}
                        onChange={e => updateService(service.id, { name: e.target.value })}
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0058be]"
                      />
                    </div>

                    <CategoryDropdown
                      value={service.category}
                      onChange={cat =>
                        updateService(service.id, {
                          category: cat,
                        })
                      }
                      categories={categories}
                      onAddCategory={addCategory}
                      onRemoveCategory={removeCategory}
                      label="Category"
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={e =>
                        updateService(service.id, {
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0058be] resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingServiceId(null)}
                      className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-[#111827] text-white shadow-2xs cursor-pointer hover:bg-black"
                    >
                      Done
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={service.id ?? service.name ?? _i}
                className="border border-[#e5e7eb] rounded-xl bg-[#fafaf9] hover:bg-white hover:border-[#d1d5db] p-3 sm:p-3.5 flex flex-col justify-between space-y-1.5 transition-all shadow-2xs"
              >
                {/* Header Row: Title, Badge, Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-[#191c1d] truncate">
                      {service.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#0058be] bg-[#f0f6ff] border border-[#dbeafe] px-2 py-0.5 rounded-full shrink-0">
                      {service.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingServiceId(service.id)}
                      className="text-[#6b7280] hover:text-[#0058be] p-1 rounded transition-colors cursor-pointer"
                      title="Edit service"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="text-[#9ca3af] hover:text-[#dc2626] p-1 rounded transition-colors cursor-pointer"
                      title="Remove service"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {service.description && (
                  <p className="text-[11px] text-[#6b7280] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Service Section */}
        {services.length >= MAX_SERVICES ? (
          <div className="border border-[#e5e7eb] rounded-xl bg-[#fafaf9] p-3 text-center text-xs text-[#6b7280] italic">
            Service capacity reached ({MAX_SERVICES}/{MAX_SERVICES})
          </div>
        ) : showAddService ? (
          <div className="border border-[#0058be]/30 bg-[#f0f6ff]/40 rounded-xl p-4 sm:p-5 space-y-3">
            <span className="text-xs font-bold text-[#0058be] block">New Service Item</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
                  Service Name (max {MAX_SERVICE_NAME_LENGTH} chars) *
                </label>
                <input
                  type="text"
                  maxLength={MAX_SERVICE_NAME_LENGTH}
                  placeholder={`e.g. Destination Brand Direction (max ${MAX_SERVICE_NAME_LENGTH} chars)`}
                  value={newServiceInput}
                  onChange={e => setNewServiceInput(e.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <CategoryDropdown
                value={newServiceCategory}
                onChange={cat => setNewServiceCategory(cat)}
                categories={categories}
                onAddCategory={addCategory}
                onRemoveCategory={removeCategory}
                label="Category"
                size="sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of this service..."
                value={newServiceDesc}
                onChange={e => setNewServiceDesc(e.target.value)}
                className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0058be] resize-none leading-relaxed"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#fafaf9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addService}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#111827] text-white shadow-2xs cursor-pointer hover:bg-black"
              >
                Add Service
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-dashed border-[#d1d5db] hover:border-[#9ca3af] bg-[#fafaf9] hover:bg-white text-xs font-medium text-[#4b5563] cursor-pointer transition-colors shadow-2xs"
          >
            <Plus size={14} /> Add service
          </button>
        )}
      </div>
    </Card>
  );
}
