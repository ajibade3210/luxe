/**
 * Central API HTTP Client for Shopwus Web Application
 * Auth tokens are stored in HttpOnly cookies set by the Fastify API.
 * The browser sends them automatically on every request via `credentials: "include"`.
 * No token is ever written to or read from localStorage or document.cookie by this client.
 */

import { STORAGE_KEYS } from "@/constants";
import { logger } from "./logger";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5555/api/v1";

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: unknown;

  constructor(message: string, status: number, code?: string, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
  errors?: unknown;
}

let isRefreshing = false;
let isRedirectingToLogin = false;
let refreshSubscribers: Array<() => void> = [];
let refreshSubscriberRejects: Array<(err: ApiError) => void> = [];

function onRefreshed() {
  for (const callback of refreshSubscribers) {
    callback();
  }
  refreshSubscribers = [];
  refreshSubscriberRejects = [];
}

function onRefreshFailed(err: ApiError) {
  for (const reject of refreshSubscriberRejects) {
    reject(err);
  }
  refreshSubscribers = [];
  refreshSubscriberRejects = [];
}

function addRefreshSubscriber(resolve: () => void, reject: (err: ApiError) => void) {
  refreshSubscribers.push(resolve);
  refreshSubscriberRejects.push(reject);
}

function handleSessionExpired() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
    // biome-ignore lint/suspicious/noDocumentCookie: clear session cookie on expiry
    document.cookie = `${STORAGE_KEYS.session}=; path=/; max-age=0; SameSite=Lax`;
    if (
      !isRedirectingToLogin &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/signup")
    ) {
      isRedirectingToLogin = true;
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth: _skipAuth, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value.trim() !== "")
      ) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers: HeadersInit = {
    ...(customConfig.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...customConfig.headers,
  };

  // credentials: "include" ensures the browser automatically sends the HttpOnly
  // shopwus_access_token cookie on every cross-origin request to the API.
  const config: RequestInit = {
    ...customConfig,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized with automatic token refresh attempt.
    // The refresh request sends the HttpOnly shopwus_refresh_token cookie automatically.
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // body token omitted; API reads HttpOnly cookie
            credentials: "include",
          });

          if (refreshRes.ok) {
            onRefreshed();
            isRefreshing = false;
            // Retry original request — new access cookie already set by the refresh response
            const retryRes = await fetch(url, config);
            return handleResponse<T>(retryRes);
          }

          // Refresh failed — clear cookies server-side by calling logout, then redirect
          const sessionErr = new ApiError("Session expired. Please sign in again.", 401);
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            credentials: "include",
          }).catch(() => {});
          onRefreshFailed(sessionErr);
          isRefreshing = false;
          handleSessionExpired();
          throw sessionErr;
        } catch (err) {
          if (err instanceof ApiError) throw err;
          const sessionErr = new ApiError("Session expired. Please sign in again.", 401);
          logger.warn("Token refresh attempt failed", err);
          onRefreshFailed(sessionErr);
          isRefreshing = false;
          handleSessionExpired();
          throw sessionErr;
        }
      } else {
        // Wait for the active refresh to finish then retry
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber(async () => {
            try {
              const retryRes = await fetch(url, config);
              resolve(await handleResponse<T>(retryRes));
            } catch (err) {
              reject(err);
            }
          }, reject);
        });
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error("API request failed", error, { endpoint, url });
    throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 500);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/pdf")) {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  if (contentType?.includes("text/csv")) {
    const text = await response.text();
    return text as unknown as T;
  }

  let rawData: unknown = null;
  try {
    rawData = await response.json();
  } catch {
    rawData = null;
  }

  const data = rawData as {
    message?: string;
    error?: string;
    code?: string;
    errors?: unknown;
    details?: unknown;
    status?: boolean;
    success?: boolean;
    data?: unknown;
  } | null;

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.error || `Request failed with status ${response.status}`;
    const apiError = new ApiError(
      errorMessage,
      response.status,
      data?.code,
      data?.errors || data?.details
    );
    if (response.status >= 500) {
      logger.error(`API Error ${response.status}: ${errorMessage}`, apiError);
    } else if (response.status !== 401) {
      logger.warn(`API Warning ${response.status}: ${errorMessage}`, apiError);
    }
    throw apiError;
  }

  // If response is standard Fastify { status: true, data: T } or { success: true, data: T }, return data directly
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    ("status" in data || "success" in data)
  ) {
    return data.data as T;
  }

  return rawData as T;
}

export const apiClient = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    options?: RequestOptions
  ) => request<T>(endpoint, { ...options, method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
