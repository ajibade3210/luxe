"use client";

import type React from "react";
import { useState } from "react";
import {
  DEFAULT_NEW_PROJECT,
  DEFAULT_PORTFOLIO_CATEGORIES,
  DEFAULT_PORTFOLIO_IMAGE,
  MAX_CATEGORY_NAME_LENGTH,
  MAX_PORTFOLIO_CATEGORIES,
  MAX_PORTFOLIO_PROJECTS,
} from "@/constants";
import { uploadBusinessLogo, uploadPortfolioImage } from "@/lib/api";
import type { PortfolioProject } from "@/types";

interface UsePortfolioSettingsOptions {
  notify: (message: string) => void;
}

export function usePortfolioSettings({ notify }: UsePortfolioSettingsOptions) {
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<string[]>([...DEFAULT_PORTFOLIO_CATEGORIES]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<PortfolioProject>>(DEFAULT_NEW_PROJECT);

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);
  const [isUploadingGalleryImages, setIsUploadingGalleryImages] = useState(false);

  // Gallery Drag & Drop Reordering State
  const [showManageGalleryModal, setShowManageGalleryModal] = useState(false);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dragOverProjectIndex, setDragOverProjectIndex] = useState<number | null>(null);

  const removeProject = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
    notify("Project removed from gallery");
  };

  const addPortfolioCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CATEGORY_NAME_LENGTH) {
      notify(`Category name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters`);
      return;
    }
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      notify(`Category "${trimmed}" already exists`);
      return;
    }
    if (categories.length >= MAX_PORTFOLIO_CATEGORIES) {
      notify(`Maximum limit of ${MAX_PORTFOLIO_CATEGORIES} categories reached`);
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    setNewProject(prev => ({ ...prev, category: trimmed }));
    notify(`Added category "${trimmed}"`);
  };

  const removePortfolioCategory = (cat: string) => {
    if (categories.length <= 1) {
      notify("You must keep at least one category");
      return;
    }
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    if (newProject.category === cat) {
      setNewProject(prev => ({ ...prev, category: updated[0] || "General" }));
    }
    notify(`Removed category "${cat}"`);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    if (portfolio.length >= MAX_PORTFOLIO_PROJECTS) {
      notify(`Maximum limit of ${MAX_PORTFOLIO_PROJECTS} portfolio projects reached`);
      return;
    }
    const coverImage = newProject.image || newProject.gallery?.[0] || DEFAULT_PORTFOLIO_IMAGE;

    const galleryImages =
      newProject.gallery && newProject.gallery.length > 0 ? newProject.gallery : [coverImage];

    const proj: PortfolioProject = {
      id: `p-${Date.now()}`,
      title: newProject.title || "Untitled Project",
      category: newProject.category || "Brand Identity",
      location: newProject.location || "Lagos & London",
      description: newProject.description || "",
      image: coverImage,
      gallery: galleryImages,
      client: newProject.client || undefined,
      year: newProject.year || "2026",
    };
    setPortfolio(prev => [proj, ...prev]);
    setShowAddProjectModal(false);
    setNewProject(DEFAULT_NEW_PROJECT);
    notify(`Added project "${proj.title}" with ${galleryImages.length} images to gallery`);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadBusinessLogo(file);
      setLogoUrl(res.url);
      notify("Logo uploaded successfully");
    } catch {
      notify("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    setNewProject(prev => {
      const updatedGallery =
        prev.gallery && prev.gallery.length > 0
          ? [localPreviewUrl, ...prev.gallery.slice(1)]
          : [localPreviewUrl];
      return { ...prev, image: localPreviewUrl, gallery: updatedGallery };
    });
    setIsUploadingProjectImage(true);
    try {
      const res = await uploadPortfolioImage(file);
      setNewProject(prev => {
        const updatedGallery =
          prev.gallery && prev.gallery.length > 0
            ? prev.gallery.map(url => (url === localPreviewUrl ? res.url : url))
            : [res.url];
        return { ...prev, image: res.url, gallery: updatedGallery };
      });
      notify("Project cover image uploaded successfully");
    } catch {
      notify("Failed to upload project image");
    } finally {
      setIsUploadingProjectImage(false);
    }
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const localPreviews = fileArray.map(file => URL.createObjectURL(file));
    setNewProject(prev => ({
      ...prev,
      gallery: [...(prev.gallery || (prev.image ? [prev.image] : [])), ...localPreviews],
    }));
    setIsUploadingGalleryImages(true);
    try {
      const uploadPromises = fileArray.map(file => uploadPortfolioImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url);
      setNewProject(prev => {
        const currentGallery = prev.gallery || [];
        // Replace temporary preview URLs with uploaded CDN URLs
        let urlIndex = 0;
        const finalGallery = currentGallery.map(url => {
          if (localPreviews.includes(url)) {
            const mappedUrl = newUrls[urlIndex] || url;
            urlIndex++;
            return mappedUrl;
          }
          return url;
        });
        return {
          ...prev,
          gallery: finalGallery,
        };
      });
      notify(`Uploaded ${results.length} gallery ${results.length === 1 ? "image" : "images"}`);
    } catch {
      notify("Failed to upload gallery images");
    } finally {
      setIsUploadingGalleryImages(false);
    }
  };

  const removeGalleryImageFromNewProject = (index: number) => {
    setNewProject(prev => {
      const currentGallery = prev.gallery || [];
      const removedUrl = currentGallery[index];
      const updated = currentGallery.filter((_, i) => i !== index);
      const isRemovingCover = prev.image && removedUrl === prev.image;
      return {
        ...prev,
        image: isRemovingCover ? updated[0] || "" : prev.image,
        gallery: updated,
      };
    });
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    if (direction === "up") {
      if (index <= 0) return;
      setPortfolio(prev => {
        const copy = [...prev];
        const temp = copy[index - 1];
        copy[index - 1] = copy[index];
        copy[index] = temp;
        return copy;
      });
    } else {
      if (index >= portfolio.length - 1) return;
      setPortfolio(prev => {
        const copy = [...prev];
        const temp = copy[index + 1];
        copy[index + 1] = copy[index];
        copy[index] = temp;
        return copy;
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedProjectIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedProjectIndex !== null && draggedProjectIndex !== index) {
      setDragOverProjectIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (
      draggedProjectIndex !== null &&
      dragOverProjectIndex !== null &&
      draggedProjectIndex !== dragOverProjectIndex
    ) {
      setPortfolio(prev => {
        const copy = [...prev];
        const [draggedItem] = copy.splice(draggedProjectIndex, 1);
        copy.splice(dragOverProjectIndex, 0, draggedItem);
        return copy;
      });
      notify("Gallery project order updated");
    }
    setDraggedProjectIndex(null);
    setDragOverProjectIndex(null);
  };

  return {
    portfolio,
    setPortfolio,
    categories,
    setCategories,
    showAddProjectModal,
    setShowAddProjectModal,
    newProject,
    setNewProject,
    logoUrl,
    setLogoUrl,
    isUploadingLogo,
    isUploadingProjectImage,
    isUploadingGalleryImages,
    showManageGalleryModal,
    setShowManageGalleryModal,
    draggedProjectIndex,
    dragOverProjectIndex,
    removeProject,
    addPortfolioCategory,
    removePortfolioCategory,
    handleAddProject,
    handleLogoUpload,
    handleProjectImageUpload,
    handleGalleryImagesUpload,
    removeGalleryImageFromNewProject,
    moveProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
