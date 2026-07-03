import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // ✅ This sends cookies automatically
  prepareHeaders: (headers) => {
    return headers;
  },
});

/**
 * 🔐 In-memory refresh state (PER USER / PER TAB)
 */
let refreshPromise: Promise<boolean> | null = null;
let refreshFailed = false;

/**
 * 🔄 Reset refresh state (call on login / logout)
 */
export const resetRefreshState = () => {
  refreshPromise = null;
  refreshFailed = false;
};

/**
 * 🚀 Base query with refresh lock + failure cache
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - try to refresh token
  if (result.error?.status === 401) {
    // If we already know refresh failed, don't try again
    if (refreshFailed) {
      api.dispatch({ type: "auth/clearAuth" });
      return result;
    }

    // Only one refresh at a time
    if (!refreshPromise) {
      refreshPromise = (async (): Promise<boolean> => {
        try {
          const refreshResult = await baseQuery(
            { url: "/auth/google/refresh", method: "POST" },
            api,
            extraOptions
          );

          if (refreshResult.error || !refreshResult.data) {
            refreshFailed = true;
            api.dispatch({ type: "auth/clearAuth" });
            return false;
          }

          refreshFailed = false;
          return true;
        } catch (error) {
          refreshFailed = true;
          api.dispatch({ type: "auth/clearAuth" });
          return false;
        }
      })().finally(() => {
        // Reset promise after a short delay to allow retry
        setTimeout(() => {
          refreshPromise = null;
        }, 100);
      });
    }

    try {
      const refreshSucceeded = await refreshPromise;
      if (refreshSucceeded) {
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      }
    } catch {
      // Refresh failed, return original 401
      return result;
    }
  }

  // Handle 403 Forbidden - don't try to refresh, just return
  if (result.error?.status === 403) {
    // 403 means authenticated but not authorized - don't clear auth
    return result;
  }

  return result;
};
