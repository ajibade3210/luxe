export type AddressComponentLike = {
  long_name: string;
  short_name?: string;
  types: string[];
};

export function extractAdminAreaFromComponents(
  components?: AddressComponentLike[] | null
): string | null {
  if (!components?.length) return null;
  const match = components.find(c => c.types.includes("administrative_area_level_1"));
  return match?.long_name?.trim() || null;
}

export function extractLocalityFromComponents(
  components?: AddressComponentLike[] | null
): string | null {
  if (!components?.length) return null;
  const match = components.find(
    c =>
      c.types.includes("locality") ||
      c.types.includes("sublocality") ||
      c.types.includes("administrative_area_level_2") ||
      c.types.includes("neighborhood")
  );
  return match?.long_name?.trim() || null;
}

export function matchGoogleComponentToOption(
  name?: string,
  options?: Array<{ value: string; label: string }> | null
): string | null {
  if (!name || !options?.length) return null;
  const cleanName = name
    .toLowerCase()
    .replace(/\s+state$/i, "")
    .trim();

  const exact = options.find(
    opt =>
      opt.label
        .toLowerCase()
        .replace(/\s+state$/i, "")
        .trim() === cleanName ||
      opt.value
        .toLowerCase()
        .replace(/\s+state$/i, "")
        .trim() === cleanName
  );
  if (exact) return exact.value;

  const partial = options.find(opt => {
    const cleanOpt = opt.label
      .toLowerCase()
      .replace(/\s+state$/i, "")
      .trim();
    return cleanOpt.includes(cleanName) || cleanName.includes(cleanOpt);
  });
  return partial?.value || null;
}
