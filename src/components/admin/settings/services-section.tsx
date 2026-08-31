import { Edit3, Plus, Tag, Trash2, X } from "lucide-react";
import { MAX_SERVICE_NAME_LENGTH, MAX_SERVICES } from "@/constants";
import type { CurrencyCode, ServicesSectionProps } from "@/types";
import { CURRENCY_SYMBOLS, formatServicePrice } from "@/utils/currency";
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
  newServicePriceType,
  setNewServicePriceType,
  newServicePrice,
  setNewServicePrice,
  newServiceMinPrice,
  setNewServiceMinPrice,
  newServiceMaxPrice,
  setNewServiceMaxPrice,
  currency = "NGN",
  addService,
  categories,
  addCategory,
  removeCategory,
}: ServicesSectionProps) {
  const currencySymbol = CURRENCY_SYMBOLS[(currency as CurrencyCode) || "NGN"] || "₦";

  return (
    <>
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
              const formattedPrice = formatServicePrice(service, currency);

              if (isEditing) {
                const editPriceType = service.priceType || (service.maxPrice ? "range" : "fixed");

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
                          className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none"
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

                    {/* Pricing Edit Row */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
                        Pricing Setup
                      </label>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="inline-flex rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateService(service.id, {
                                priceType: "fixed",
                                minPrice: null,
                                maxPrice: null,
                              })
                            }
                            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                              editPriceType === "fixed"
                                ? "bg-white text-[#111827] shadow-xs"
                                : "text-[#6b7280] hover:text-[#111827]"
                            }`}
                          >
                            Fixed Price
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateService(service.id, {
                                priceType: "range",
                                minPrice: service.minPrice || service.price || null,
                              })
                            }
                            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                              editPriceType === "range"
                                ? "bg-white text-[#111827] shadow-xs"
                                : "text-[#6b7280] hover:text-[#111827]"
                            }`}
                          >
                            Price Range
                          </button>
                        </div>
                      </div>

                      {editPriceType === "fixed" ? (
                        <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden max-w-xs">
                          <div className="bg-[#f9fafb] px-3 py-1.5 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                            {currencySymbol}
                          </div>
                          <input
                            type="number"
                            placeholder="150,000"
                            value={service.price ?? ""}
                            onChange={e => {
                              const val = e.target.value ? Number(e.target.value) : null;
                              updateService(service.id, { price: val });
                            }}
                            className="w-full bg-transparent px-3 py-1.5 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
                          <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden">
                            <div className="bg-[#f9fafb] px-2.5 py-1.5 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                              {currencySymbol}
                            </div>
                            <input
                              type="number"
                              placeholder="Min: 150,000"
                              value={service.minPrice ?? service.price ?? ""}
                              onChange={e => {
                                const val = e.target.value ? Number(e.target.value) : null;
                                updateService(service.id, { minPrice: val, price: val });
                              }}
                              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden">
                            <div className="bg-[#f9fafb] px-2.5 py-1.5 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                              {currencySymbol}
                            </div>
                            <input
                              type="number"
                              placeholder="Max: 500,000"
                              value={service.maxPrice ?? ""}
                              onChange={e => {
                                const val = e.target.value ? Number(e.target.value) : null;
                                updateService(service.id, { maxPrice: val });
                              }}
                              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
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
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#111827] focus:outline-none resize-none leading-relaxed"
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
                  className="border border-[#e5e7eb] rounded-xl bg-[#fafaf9] hover:bg-white hover:border-[#d1d5db] p-3 sm:p-3.5 flex flex-col justify-between space-y-2 transition-all shadow-2xs"
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
                      {formattedPrice && (
                        <span className="text-[10px] font-bold text-[#166534] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1">
                          <Tag size={10} />
                          {formattedPrice}
                        </span>
                      )}
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

          {/* Add Service Button / Trigger */}
          {services.length >= MAX_SERVICES ? (
            <div className="border border-[#e5e7eb] rounded-xl bg-[#fafaf9] p-3 text-center text-xs text-[#6b7280] italic">
              Service capacity reached ({MAX_SERVICES}/{MAX_SERVICES})
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

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#0058be] font-semibold">
                  Service Offering
                </span>
                <h3 className="font-sans text-lg text-[#191c1d] font-bold mt-0.5">
                  Add New Service
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="text-[#6b7280] hover:text-[#191c1d] p-1.5 rounded-md hover:bg-[#f3f4f5] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Service Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  maxLength={MAX_SERVICE_NAME_LENGTH}
                  placeholder={`e.g. Brand Identity Direction (max ${MAX_SERVICE_NAME_LENGTH} chars)`}
                  value={newServiceInput}
                  onChange={e => setNewServiceInput(e.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2 text-xs text-[#111827] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <CategoryDropdown
                  value={newServiceCategory}
                  onChange={cat => setNewServiceCategory(cat)}
                  categories={categories}
                  onAddCategory={addCategory}
                  onRemoveCategory={removeCategory}
                  label="Category"
                  size="md"
                />
              </div>

              {/* Pricing Section */}
              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1.5">
                  Pricing (Optional)
                </label>

                {/* Fixed vs Range Segmented Toggle */}
                <div className="flex rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] p-0.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setNewServicePriceType("fixed")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      newServicePriceType === "fixed"
                        ? "bg-white text-[#111827] shadow-xs"
                        : "text-[#6b7280] hover:text-[#111827]"
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewServicePriceType("range")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      newServicePriceType === "range"
                        ? "bg-white text-[#111827] shadow-xs"
                        : "text-[#6b7280] hover:text-[#111827]"
                    }`}
                  >
                    Price Range
                  </button>
                </div>

                {/* Price Inputs */}
                {newServicePriceType === "fixed" ? (
                  <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden">
                    <div className="bg-[#f9fafb] px-3.5 py-2 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                      {currencySymbol}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="150,000"
                      value={newServicePrice}
                      onChange={e => setNewServicePrice(e.target.value)}
                      className="w-full bg-transparent px-3 py-2 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden">
                      <div className="bg-[#f9fafb] px-3 py-2 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                        {currencySymbol}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Min: 150,000"
                        value={newServiceMinPrice}
                        onChange={e => setNewServiceMinPrice(e.target.value)}
                        className="w-full bg-transparent px-2.5 py-2 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center rounded-lg border border-[#d1d5db] bg-white overflow-hidden">
                      <div className="bg-[#f9fafb] px-3 py-2 border-r border-[#e5e7eb] text-xs font-bold text-[#4b5563] select-none shrink-0">
                        {currencySymbol}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Max: 500,000"
                        value={newServiceMaxPrice}
                        onChange={e => setNewServiceMaxPrice(e.target.value)}
                        className="w-full bg-transparent px-2.5 py-2 text-xs text-[#111827] outline-none border-none shadow-none focus:outline-none"
                      />
                    </div>
                  </div>
                )}
                <span className="block text-[10px] text-[#6b7280] mt-1">
                  Leave blank if you prefer clients to contact you for a custom quote.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of what this service covers..."
                  value={newServiceDesc}
                  onChange={e => setNewServiceDesc(e.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2 text-xs text-[#111827] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="flex-1 py-2 rounded-lg border border-[#d1d5db] bg-white text-xs font-semibold text-[#374151] hover:bg-[#f9fafb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addService}
                className="flex-1 py-2 rounded-lg bg-[#111827] hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
