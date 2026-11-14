const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const ACCESS_TOKEN_KEY = "manthanpayAuthToken";
const CSRF_ENDPOINT = "/api/auth/csrf";
const REFRESH_ENDPOINT = "/api/auth/refresh";

let refreshPromise = null;

function isAuthEndpoint(endpoint) {
  const path = endpoint.split("?")[0];

  // Change password is a protected endpoint.
  // It requires Bearer access token and normal 401 refresh handling.
  return (
    path.startsWith("/api/auth/") &&
    path !== "/api/auth/change-password"
  );
}

function readAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveAccessToken(token) {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Refresh response did not contain a valid access token.");
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAuthenticationAndRedirect() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function readResponseData(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function getErrorMessage(response, data) {
  let message = `Request failed: ${response.status}`;

  if (typeof data === "string" && data.trim()) {
    message = data;
  } else if (data && typeof data === "object") {
    message = data.message || data.error || message;
  } else if (response.statusText) {
    message = `${message} ${response.statusText}`;
  }

  return message;
}

function createApiError(response, data) {
  const error = new Error(getErrorMessage(response, data));
  error.status = response.status;
  error.data = data;
  return error;
}

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}${CSRF_ENDPOINT}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await readResponseData(response);

  if (!response.ok) {
    const error = createApiError(response, data);

    if (response.status === 401 || response.status === 403) {
      error.authenticationRejected = true;
    }

    throw error;
  }

  const token =
    data?.token ||
    data?.csrfToken ||
    data?._csrf?.token ||
    data?.data?.token ||
    "";

  if (typeof token !== "string" || !token.trim()) {
    throw new Error(
      "CSRF token was not found in the /api/auth/csrf response."
    );
  }

  return token;
}

async function performTokenRefresh() {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    cache: "no-store",
  });

  const data = await readResponseData(response);

  if (!response.ok) {
    const error = createApiError(response, data);

    if (response.status === 401 || response.status === 403) {
      error.authenticationRejected = true;
    }

    throw error;
  }

  const accessToken =
    data?.accessToken ||
    data?.data?.accessToken ||
    "";

  saveAccessToken(accessToken);

  return accessToken;
}

async function getFreshAccessToken(failedToken) {
  const currentToken = readAccessToken();

  // Kisi doosri request ne pehle hi token refresh kar diya ho.
  if (currentToken && currentToken !== failedToken) {
    return currentToken;
  }

  // Concurrent 401 requests ke liye ek hi refresh request.
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  try {
    return await refreshPromise;
  } catch (error) {
    if (error.authenticationRejected) {
      clearAuthenticationAndRedirect();
    }

    throw error;
  }
}

function prepareRequest(endpoint, options, token) {
  const isAuth = isAuthEndpoint(endpoint);
  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  const body = options.body;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const isPlainObject =
    body !== null &&
    typeof body === "object" &&
    !isFormData &&
    (Object.getPrototypeOf(body) === Object.prototype ||
      Object.getPrototypeOf(body) === null);

  if (isPlainObject) {
    headers.set("Content-Type", "application/json");
  }

  if (isAuth) {
    headers.delete("Authorization");
  } else if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return {
    ...options,
    credentials: "include",
    headers,
    body: isPlainObject ? JSON.stringify(body) : body,
  };
}

export async function apiRequest(endpoint, options = {}) {
  if (typeof window === "undefined") {
    throw new Error("API requests must be made from the browser.");
  }

  const authEndpoint = isAuthEndpoint(endpoint);
  const originalToken = readAccessToken();

  const requestOptions = prepareRequest(
    endpoint,
    options,
    originalToken
  );

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    requestOptions
  );

  // Login, OTP, refresh aur logout endpoints ko auto-refresh nahi karna.
  if (response.status === 401 && !authEndpoint) {
    const freshToken = await getFreshAccessToken(originalToken);

    const retryOptions = prepareRequest(
      endpoint,
      options,
      freshToken
    );

    // Original request sirf ek baar retry hogi.
    const retryResponse = await fetch(
      `${API_BASE_URL}${endpoint}`,
      retryOptions
    );

    const retryData = await readResponseData(retryResponse);

    if (!retryResponse.ok) {
      throw createApiError(retryResponse, retryData);
    }

    return retryData;
  }

  const data = await readResponseData(response);

  if (!response.ok) {
    throw createApiError(response, data);
  }

  return data;
}
// Binary image/file API request.
// Existing JWT refresh mechanism is reused.
export async function apiBlobRequest(endpoint, options = {}) {
  if (typeof window === "undefined") {
    throw new Error("API requests must be made from the browser.");
  }

  const authEndpoint = isAuthEndpoint(endpoint);
  const originalToken = readAccessToken();

  const requestOptions = prepareRequest(
    endpoint,
    options,
    originalToken
  );

  requestOptions.headers.set("Accept", "*/*");

  let response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    requestOptions
  );

  if (response.status === 401 && !authEndpoint) {
    const freshToken = await getFreshAccessToken(originalToken);

    const retryOptions = prepareRequest(
      endpoint,
      options,
      freshToken
    );

    retryOptions.headers.set("Accept", "*/*");

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      retryOptions
    );
  }

  if (!response.ok) {
    const data = await readResponseData(response);
    throw createApiError(response, data);
  }

  return response.blob();
}
