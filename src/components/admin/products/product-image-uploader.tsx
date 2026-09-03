"use client";

import { X } from "lucide-react";
import type { ProductImageUploaderProps } from "@/types";

export function ProductImageUploader({
  images,
  imageInput,
  onImageInputChange,
  onAddImage,
  onRemoveImage,
}: ProductImageUploaderProps) {
  return (
    <div className="pt-4 border-t border-[#eee7dc]">
      <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-2">
        Product Images
      </h3>
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          value={imageInput}
          onChange={e => onImageInputChange(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="flex-1 px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-mono transition-all"
        />
        <button
          type="button"
          onClick={onAddImage}
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-4 py-2 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
        >
          Add Image
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group w-16 h-16 rounded-xl border border-[#eee7dc] overflow-hidden bg-gray-50 shadow-2xs"
            >
              <img src={img} alt="Product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(idx)}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
