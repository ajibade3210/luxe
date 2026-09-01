"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  getGoogleMapsApiKey,
  isGoogleMapsConfigured,
  loadGoogleMapsScript,
} from "@/lib/google-maps-script";
import {
  extractAdminAreaFromComponents,
  extractLocalityFromComponents,
  matchGoogleComponentToOption,
} from "@/lib/google-place-parse";
import type {
  GooglePlacesAutocompleteFieldProps,
  PlacePrediction,
  PlaceResult,
  PlacesNs,
} from "@/types";

const defaultInputClassName = [
  "w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827]",
  "transition-colors duration-150",
  "focus:outline-none shadow-2xs",
  "hover:border-gray-400",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "placeholder:text-[#9ca3af]",
].join(" ");

const DEBOUNCE_MS = 320;
const MIN_CHARS = 2;

function getPlaces(): PlacesNs | null {
  const g = (window as unknown as { google?: { maps?: { places?: PlacesNs } } }).google?.maps
    ?.places;
  return g ?? null;
}

/**
 * Uses programmatic Places APIs (AutocompleteService + PlacesService) and a React dropdown.
 * The legacy `Autocomplete` widget attached to an input conflicts with React; this matches
 * Google’s behavior without binding the widget to the DOM input.
 */
export function GooglePlacesAutocompleteField({
  label,
  required,
  placeholder = "e.g. Victoria Island, Lagos, Nigeria",
  hint,
  value,
  onChange,
  onPlaceSelected,
  stateOptions = [],
  cityOptions = [],
  disabled,
  className = "",
  inputClassName: inputClassNameProp,
  showApiKeyHint = true,
  inputRef,
  onInputKeyDown,
  testId,
}: GooglePlacesAutocompleteFieldProps) {
  const reactId = useId();
  const inputId = `gmaps-addr-${reactId.replace(/:/g, "")}`;
  const listboxId = `${inputId}-listbox`;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [apiReady, setApiReady] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);
  const servicesRef = useRef<{
    auto: InstanceType<PlacesNs["AutocompleteService"]>;
    places: InstanceType<PlacesNs["PlacesService"]>;
  } | null>(null);
  const sessionTokenRef = useRef<unknown>(null);

  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const stateOptionsRef = useRef(stateOptions);
  const cityOptionsRef = useRef(cityOptions);

  useLayoutEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected;
    stateOptionsRef.current = stateOptions;
    cityOptionsRef.current = cityOptions;
  });

  const newSessionToken = useCallback(() => {
    const places = getPlaces();
    if (!places?.AutocompleteSessionToken) return null;
    const t = new places.AutocompleteSessionToken();
    sessionTokenRef.current = t;
    return t;
  }, []);

  useEffect(() => {
    if (!isGoogleMapsConfigured() || disabled) return;

    let cancelled = false;
    void (async () => {
      try {
        const cachedApiKey = await getGoogleMapsApiKey();
        if (!cachedApiKey || cancelled) return;

        await loadGoogleMapsScript(cachedApiKey);
        if (cancelled) return;

        const places = getPlaces();
        if (!places?.AutocompleteService || !places.PlacesService) return;

        const anchor = document.createElement("div");
        servicesRef.current = {
          auto: new places.AutocompleteService(),
          places: new places.PlacesService(anchor),
        };
        newSessionToken();
        setApiReady(true);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [disabled, newSessionToken]);

  const runSuggest = useCallback(
    (q: string) => {
      const svc = servicesRef.current?.auto;
      const places = getPlaces();
      if (!svc || !places || !q.trim() || q.trim().length < MIN_CHARS) {
        setPredictions([]);
        setLoadingSuggest(false);
        return;
      }

      const myId = ++reqIdRef.current;
      setLoadingSuggest(true);

      const token = sessionTokenRef.current ?? newSessionToken();

      svc.getPlacePredictions(
        {
          input: q.trim(),
          componentRestrictions: { country: "ng" },
          ...(token ? { sessionToken: token } : {}),
        },
        (results, status) => {
          if (myId !== reqIdRef.current) return;
          setLoadingSuggest(false);
          if (status !== "OK" || !results?.length) {
            setPredictions([]);
            setHighlightIndex(-1);
            return;
          }
          setPredictions(results as PlacePrediction[]);
          setHighlightIndex(results.length ? 0 : -1);
        }
      );
    },
    [newSessionToken]
  );

  useEffect(() => {
    if (!apiReady || disabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSuggest(value);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, apiReady, disabled, runSuggest]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pickPrediction = useCallback(
    (p: PlacePrediction) => {
      const places = getPlaces();
      const svc = servicesRef.current?.places;
      if (!places || !svc) return;

      setOpen(false);
      setPredictions([]);

      const token = sessionTokenRef.current;

      svc.getDetails(
        {
          placeId: p.place_id,
          fields: ["formatted_address", "geometry", "address_components", "name"],
          ...(token ? { sessionToken: token } : {}),
        },
        (place, status) => {
          newSessionToken();

          if (status !== "OK" || !place) {
            onChange(p.description);
            return;
          }

          const pr = place as PlaceResult;
          const addr = pr.formatted_address?.trim() ?? p.description;
          const lat = pr.geometry?.location?.lat();
          const lng = pr.geometry?.location?.lng();
          if (lat == null || lng == null) {
            onChange(addr);
            return;
          }

          onChange(addr);

          const comps = pr.address_components;
          const stateLong = extractAdminAreaFromComponents(comps);
          const cityLong = extractLocalityFromComponents(comps);
          const stateSel = matchGoogleComponentToOption(
            stateLong ?? undefined,
            stateOptionsRef.current
          );
          const citySel = matchGoogleComponentToOption(
            cityLong ?? undefined,
            cityOptionsRef.current
          );

          onPlaceSelectedRef.current?.({
            address: addr,
            latitude: lat,
            longitude: lng,
            stateValue: stateSel,
            cityValue: citySel,
            stateLabel: stateLong ?? null,
            cityLabel: cityLong ?? null,
          });
        }
      );
    },
    [onChange, newSessionToken]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (open && predictions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex(i => Math.min(i + 1, predictions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && highlightIndex >= 0) {
        e.preventDefault();
        pickPrediction(predictions[highlightIndex]!);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
    }
    onInputKeyDown?.(e);
  };

  const configured = isGoogleMapsConfigured();
  const showList =
    configured && apiReady && open && (predictions.length > 0 || loadingSuggest) && !disabled;

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#374151] tracking-wide block"
        >
          {label}
          {required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          data-testid={testId}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={inputClassNameProp ?? defaultInputClassName}
        />

        {showList && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-[10050] mt-1 max-h-60 overflow-auto rounded-xl border border-[#EAECF0] bg-white py-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
          >
            {loadingSuggest && predictions.length === 0 && (
              <div className="px-3 py-2.5 font-sans text-xs text-[#667085]">Searching…</div>
            )}
            {predictions.map((pred, idx) => {
              const primary = pred.structured_formatting?.main_text ?? pred.description;
              const secondary = pred.structured_formatting?.secondary_text;
              return (
                <div key={pred.place_id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === highlightIndex}
                    className={[
                      "w-full px-3.5 py-2.5 text-left font-sans text-xs sm:text-sm leading-snug text-[#344054] cursor-pointer",
                      idx === highlightIndex ? "bg-[#F9FAFB]" : "hover:bg-[#F9FAFB]",
                    ].join(" ")}
                    onMouseDown={ev => ev.preventDefault()}
                    onClick={() => pickPrediction(pred)}
                  >
                    <span className="font-semibold block text-[#111827]">{primary}</span>
                    {secondary ? (
                      <span className="mt-0.5 block text-[11px] font-normal text-[#667085]">
                        {secondary}
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hint && <p className="text-xs text-[#667085]">{hint}</p>}
      {showApiKeyHint && !configured && (
        <p className="text-xs text-[#667085]">
          Add <code className="rounded bg-[#F9FAFB] px-1 text-[11px]">GOOGLE_MAPS_API_KEY</code>{" "}
          with Maps JavaScript API and Places API enabled.
        </p>
      )}
    </div>
  );
}
