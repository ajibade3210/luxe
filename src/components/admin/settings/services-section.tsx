import { Plus, Trash2 } from "lucide-react";
import type { ServiceItem } from "@/lib/types";
import { Card } from "./card";

interface ServicesSectionProps {
  services: ServiceItem[];
  editingServiceId: string | null;
  setEditingServiceId: (id: string | null) => void;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  removeService: (id: string) => void;
  showAddService: boolean;
  setShowAddService: (v: boolean) => void;
  newServiceInput: string;
  setNewServiceInput: (v: string) => void;
  newServiceCategory: string;
  setNewServiceCategory: (v: string) => void;
  newServiceDesc: string;
  setNewServiceDesc: (v: string) => void;
  addService: () => void;
}

export function ServicesSection({
  services,
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
}: ServicesSectionProps) {
  return (
    <Card
      title="Services & offerings"
      description="Make your expertise easy to understand for prospective couples and clients."
    >
      <div className="space-y-3">
        {/* Service rows */}
        {services.map((service, _i) => (
          <div
            key={service.id ?? service.name ?? _i}
            className="border border-[#e5e7eb] rounded-lg bg-white"
          >
            {editingServiceId === service.id ? (
              /* Inline edit form */
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                      Service Name
                    </span>
                    <input
                      value={service.name}
                      onChange={e => updateService(service.id, { name: e.target.value })}
                      className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                      Category
                    </span>
                    <input
                      value={service.category}
                      onChange={e =>
                        updateService(service.id, {
                          category: e.target.value,
                        })
                      }
                      list="category-options"
                      className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                    />
                    <datalist id="category-options">
                      {["Bespoke", "Corporate", "Creative", "Concierge"].map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </label>
                </div>
                <label className="block">
                  <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                    Description
                  </span>
                  <textarea
                    rows={2}
                    value={service.description}
                    onChange={e =>
                      updateService(service.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
                  />
                </label>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingServiceId(null)}
                    className="outline-button text-xs py-1.5 px-3"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Collapsed view */
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#191c1d] truncate">
                      {service.name}
                    </span>
                    <span className="text-[10px] font-medium text-[#0058be] bg-[#f0f6ff] border border-[#dbeafe] px-2 py-0.5 rounded-full shrink-0">
                      {service.category}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-1">
                      {service.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingServiceId(service.id)}
                    className="text-xs text-[#0058be] hover:underline px-2 py-1 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="text-[#9ca3af] hover:text-[#dc2626] p-1 rounded transition-colors"
                    title="Remove service"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Service Section */}
        {showAddService ? (
          <div className="border border-[#0058be]/30 bg-[#f0f6ff]/40 rounded-lg p-4 space-y-3">
            <span className="text-xs font-bold text-[#0058be] block">New Service Item</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                  Service Name *
                </span>
                <input
                  type="text"
                  placeholder="e.g. Destination Wedding Planning"
                  value={newServiceInput}
                  onChange={e => setNewServiceInput(e.target.value)}
                  className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                  Category
                </span>
                <input
                  type="text"
                  placeholder="e.g. Bespoke"
                  value={newServiceCategory}
                  onChange={e => setNewServiceCategory(e.target.value)}
                  list="new-category-options"
                  className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
                <datalist id="new-category-options">
                  {["Bespoke", "Corporate", "Creative", "Concierge"].map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
            </div>
            <label className="block">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide block mb-1">
                Description
              </span>
              <textarea
                rows={2}
                placeholder="Brief description of this service..."
                value={newServiceDesc}
                onChange={e => setNewServiceDesc(e.target.value)}
                className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
              />
            </label>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="outline-button text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addService}
                className="dark-button text-xs py-1.5 px-4"
              >
                Add Service
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="add-service cursor-pointer w-full"
          >
            <Plus size={14} /> Add service
          </button>
        )}
      </div>
    </Card>
  );
}
