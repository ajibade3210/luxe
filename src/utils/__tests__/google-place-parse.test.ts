import { describe, expect, it } from "vitest";
import {
  type AddressComponentLike,
  extractAdminAreaFromComponents,
  extractLocalityFromComponents,
  matchGoogleComponentToOption,
} from "@/lib/google-place-parse";

describe("google-place-parse utilities", () => {
  const sampleComponents: AddressComponentLike[] = [
    { long_name: "Victoria Island", short_name: "VI", types: ["neighborhood", "political"] },
    { long_name: "Lagos", short_name: "LA", types: ["locality", "political"] },
    {
      long_name: "Lagos State",
      short_name: "LA",
      types: ["administrative_area_level_1", "political"],
    },
    { long_name: "Nigeria", short_name: "NG", types: ["country", "political"] },
  ];

  it("extracts administrative area (state) correctly", () => {
    expect(extractAdminAreaFromComponents(sampleComponents)).toBe("Lagos State");
    expect(extractAdminAreaFromComponents([])).toBeNull();
    expect(extractAdminAreaFromComponents(undefined)).toBeNull();
  });

  it("extracts locality / city correctly", () => {
    expect(extractLocalityFromComponents(sampleComponents)).toBe("Victoria Island");
    expect(extractLocalityFromComponents([])).toBeNull();
  });

  it("matches google components to application state options", () => {
    const states = [
      { value: "lagos", label: "Lagos" },
      { value: "ogun", label: "Ogun" },
      { value: "rivers", label: "Rivers" },
      { value: "abuja", label: "FCT - Abuja" },
    ];
    expect(matchGoogleComponentToOption("Lagos State", states)).toBe("lagos");
    expect(matchGoogleComponentToOption("Lagos", states)).toBe("lagos");
    expect(matchGoogleComponentToOption("Abuja", states)).toBe("abuja");
    expect(matchGoogleComponentToOption("Unknown Place", states)).toBeNull();
  });
});
