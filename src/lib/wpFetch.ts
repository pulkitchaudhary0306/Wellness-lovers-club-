/**
 * wpFetch.ts
 *
 * WordPress Fetch Wrapper
 */

import { getStoredToken } from "./tokenStorage";

interface WPErrorBody {
  code?: string;
  message?: string;
  data?: {
    status?: number;
  };
}

export interface WPFetchOptions extends RequestInit {
  unauthenticated?: boolean;
  formData?: boolean;
}

export class WPApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "WPApiError";
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

function isWPErrorBody(body: unknown): body is WPErrorBody {
  return typeof body === "object" && body !== null;
}

const BASE_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://cms.wellnessloversclub.com"
).replace(/\/$/, "");

export async function wpFetch<T = unknown>(
  endpoint: string,
  options: WPFetchOptions = {}
): Promise<T> {
  const {
    unauthenticated = false,
    formData = false,
    ...fetchOptions
  } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!formData) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  if (!unauthenticated) {
    const token = getStoredToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const url = isLocalDev ? endpoint : `${BASE_URL}${endpoint}`;

  // 10-second timeout guard to ensure fetch never hangs React loading states
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, 10000);

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal,
    });
  } catch (fetchErr: any) {
    if (fetchErr instanceof WPApiError) {
      throw fetchErr;
    }
    if (fetchErr?.name === "AbortError") {
      throw new WPApiError("timeout", "Unable to connect to the server. Request timed out.", 408);
    }
    const msg = String(fetchErr?.message || "");
    if (
      fetchErr?.name === "TypeError" ||
      msg.includes("Failed to fetch") ||
      msg.includes("NetworkError") ||
      msg.includes("Load failed") ||
      msg.includes("fetch failed")
    ) {
      throw new WPApiError(
        "network_error",
        "Unable to connect to the server. Please check your connection and try again.",
        0
      );
    }
    throw new WPApiError(
      "network_error",
      msg || "Unable to connect to the server.",
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let body: any;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const errorBody = isWPErrorBody(body) ? body : undefined;

    throw new WPApiError(
      errorBody?.code ?? "unknown_error",
      errorBody?.message ??
        (typeof body === "string" && body.trim().length > 0
          ? body
          : `Request failed (${response.status})`),
      errorBody?.data?.status ?? response.status
    );
  }

  return body as T;
}

export const wpGet = <T>(endpoint: string, opts?: WPFetchOptions) =>
  wpFetch<T>(endpoint, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    ...opts,
  });

export const wpPost = <T>(
  endpoint: string,
  data: unknown,
  opts?: WPFetchOptions
) =>
  wpFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    ...opts,
  });

export const wpPut = <T>(
  endpoint: string,
  data: unknown,
  opts?: WPFetchOptions
) =>
  wpFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    ...opts,
  });

export const wpPatch = <T>(
  endpoint: string,
  data: unknown,
  opts?: WPFetchOptions
) =>
  wpFetch<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...opts,
  });

export const wpDelete = <T>(
  endpoint: string,
  opts?: WPFetchOptions
) =>
  wpFetch<T>(endpoint, {
    method: "DELETE",
    ...opts,
  });
