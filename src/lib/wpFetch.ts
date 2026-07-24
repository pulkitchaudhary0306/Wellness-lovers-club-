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

  const url = `${BASE_URL}${endpoint}`;

  console.log("========================================");
  console.log("WordPress API Request");
  console.log("URL:", url);
  console.log("Method:", fetchOptions.method);
  console.log("Has Token:", headers.has("Authorization"));
  console.log("========================================");

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  console.log("========================================");
  console.log("WordPress API Response");
  console.log("Status:", response.status);
  console.log("Response URL:", response.url);
  console.log("========================================");

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

  console.log("Response Body:", body);

  if (!response.ok) {
    const errorBody = isWPErrorBody(body) ? body : undefined;

    throw new WPApiError(
      errorBody?.code ?? "unknown_error",
      errorBody?.message ??
        (typeof body === "string" && body.trim()
          ? body
          : `Request failed (${response.status})`),
      errorBody?.data?.status ?? response.status
    );
  }

  return body as T;
}

export const wpGet = <T>(
  endpoint: string,
  opts?: WPFetchOptions
) =>
  wpFetch<T>(endpoint, {
    method: "GET",
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
