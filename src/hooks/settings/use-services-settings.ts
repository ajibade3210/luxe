"use client";

import { useState } from "react";
import { MAX_SERVICE_NAME_LENGTH, MAX_SERVICES } from "@/constants";
import type { ServiceItem } from "@/types";

interface UseServicesSettingsOptions {
  notify: (message: string) => void;
}

export function useServicesSettings({ notify }: UseServicesSettingsOptions) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Bespoke");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServicePriceType, setNewServicePriceType] = useState<"fixed" | "range">("fixed");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceMinPrice, setNewServiceMinPrice] = useState("");
  const [newServiceMaxPrice, setNewServiceMaxPrice] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const addService = () => {
    const trimmedName = newServiceInput.trim();
    if (!trimmedName) return;
    if (trimmedName.length > MAX_SERVICE_NAME_LENGTH) {
      notify(`Service name cannot exceed ${MAX_SERVICE_NAME_LENGTH} characters`);
      return;
    }
    if (services.length >= MAX_SERVICES) {
      notify(`Maximum limit of ${MAX_SERVICES} services reached`);
      return;
    }
    if (services.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      notify(`Service "${trimmedName}" already exists`);
      return;
    }

    let parsedPrice: number | undefined;
    let parsedMinPrice: number | undefined;
    let parsedMaxPrice: number | undefined;

    if (newServicePriceType === "fixed") {
      const cleanPrice = Number(newServicePrice.replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(cleanPrice) && cleanPrice > 0) {
        parsedPrice = cleanPrice;
      }
    } else {
      const cleanMin = Number(newServiceMinPrice.replace(/[^0-9.]/g, ""));
      const cleanMax = Number(newServiceMaxPrice.replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(cleanMin) && cleanMin > 0) {
        parsedMinPrice = cleanMin;
        parsedPrice = cleanMin;
      }
      if (!Number.isNaN(cleanMax) && cleanMax > 0) {
        parsedMaxPrice = cleanMax;
      }
    }

    const newSvc: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: trimmedName,
      category: newServiceCategory.trim() || "General",
      description: newServiceDesc.trim(),
      priceType: newServicePriceType,
      price: parsedPrice,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    };
    setServices(prev => [...prev, newSvc]);
    setNewServiceInput("");
    setNewServiceDesc("");
    setNewServicePrice("");
    setNewServiceMinPrice("");
    setNewServiceMaxPrice("");
    setNewServicePriceType("fixed");
    setShowAddService(false);
    notify(`Added service "${newSvc.name}"`);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    notify("Service removed");
  };

  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  return {
    services,
    setServices,
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
    editingServiceId,
    setEditingServiceId,
    addService,
    removeService,
    updateService,
  };
}
