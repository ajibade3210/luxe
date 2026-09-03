export interface DeliveryZone {
  id: string;
  businessId: string;
  name: string;
  states: string[];
  fee: number | string;
  estimatedDays?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySettings {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  enableStorePickup: boolean;
  pickupInstructions?: string | null;
  enableHomeDelivery: boolean;
  freeDeliveryThreshold?: number | string | null;
}

export interface StorefrontDeliveryConfig {
  enableStorePickup: boolean;
  pickupLocation?: string | null;
  pickupInstructions?: string | null;
  enableHomeDelivery: boolean;
  freeDeliveryThreshold?: number | null;
  deliveryZones: Array<{
    id: string;
    name: string;
    states: string[];
    fee: number;
    estimatedDays?: string | null;
  }>;
}

export interface CreateDeliveryZoneInput {
  name: string;
  states: string[];
  fee: number;
  estimatedDays?: string | null;
  isActive?: boolean;
}

export interface UpdateDeliverySettingsInput {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  enableStorePickup?: boolean;
  pickupInstructions?: string | null;
  enableHomeDelivery?: boolean;
  freeDeliveryThreshold?: number | null;
}

export interface DeliveryZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingZone: DeliveryZone | null;
  zoneName: string;
  zoneFee: string;
  zoneEstimatedDays: string;
  selectedStates: string[];
  isSubmitting: boolean;
  onZoneNameChange: (name: string) => void;
  onZoneFeeChange: (fee: string) => void;
  onZoneEstimatedDaysChange: (days: string) => void;
  onToggleState: (stateName: string) => void;
  onSelectAllStates: () => void;
  onDeselectAllStates: () => void;
  onSubmit: (e: React.FormEvent) => void;
}
