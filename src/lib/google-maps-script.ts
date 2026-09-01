let cachedApiKey: string | null = null;
let scriptPromise: Promise<boolean> | null = null;

export function isGoogleMapsConfigured(): boolean {
  return true;
}

export async function getGoogleMapsApiKey(): Promise<string> {
  if (cachedApiKey !== null) {
    return cachedApiKey;
  }

  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    cachedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return cachedApiKey;
  }

  try {
    const res = await fetch("/api/maps/config");
    if (!res.ok) {
      cachedApiKey = "";
      return "";
    }
    const data = await res.json();
    const key = (data?.apiKey as string) || "";
    cachedApiKey = key;
    return key;
  } catch {
    cachedApiKey = "";
    return "";
  }
}

export function loadGoogleMapsScript(apiKey: string): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // @ts-expect-error google maps window global
  if (window.google?.maps?.places) {
    return Promise.resolve(true);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise(resolve => {
    if (!apiKey) {
      resolve(false);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      // @ts-expect-error google maps window global
      if (window.google?.maps?.places) {
        resolve(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return scriptPromise;
}
