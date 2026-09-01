export interface AddressComponentLike {
  long_name: string;
  short_name?: string;
  types: string[];
}

export interface GooglePlacesSelected {
  address: string;
  latitude: number;
  longitude: number;
  stateValue: string | null;
  cityValue: string | null;
  /** Administrative area long name from Google when present (e.g. "Lagos"). */
  stateLabel: string | null;
  /** Locality / sublocality long name from Google when present. */
  cityLabel: string | null;
}

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: { main_text?: string; secondary_text?: string };
}

export interface PlaceResult {
  formatted_address?: string;
  address_components?: AddressComponentLike[];
  geometry?: { location?: { lat: () => number; lng: () => number } };
  name?: string;
}

export interface PlacesNs {
  AutocompleteService: new () => {
    getPlacePredictions: (
      request: object,
      callback: (predictions: PlacePrediction[] | null, status: string) => void
    ) => void;
  };
  PlacesService: new (
    attrContainer: HTMLDivElement
  ) => {
    getDetails: (
      request: object,
      callback: (place: PlaceResult | null, status: string) => void
    ) => void;
  };
  PlacesServiceStatus: { OK: string };
  AutocompleteSessionToken: new () => unknown;
}

export interface GooglePlacesAutocompleteFieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: GooglePlacesSelected) => void;
  stateOptions?: Array<{ value: string; label: string }>;
  cityOptions?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
  /** When set, replaces the default input Tailwind classes (e.g. hero bar inline field). */
  inputClassName?: string;
  /** When false, hides the "Add GOOGLE_MAPS_API_KEY" hint (e.g. compact embeds). */
  showApiKeyHint?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  /** Runs when the listbox does not handle the key (e.g. Enter to submit a parent form / run search). */
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** E2E: applied to the address input. */
  testId?: string;
}
