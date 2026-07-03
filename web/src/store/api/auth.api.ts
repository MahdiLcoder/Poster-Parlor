import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth, resetRefreshState } from "./base.query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    loginWithGoogle: builder.mutation({
      query: (idToken) => ({
        url: "/auth/google/login",
        method: "POST",
        body: { idToken },
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;

          // ✅ LOGIN SUCCESS → reset refresh cache
          resetRefreshState();
        } catch {
          // login failed → do nothing
        }
      },
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/google/refresh",
        method: "POST",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/google/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      // ✅ Clear auth state on successful logout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch({ type: "auth/clearAuth" });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          // ✅ LOGOUT → reset everything
          resetRefreshState();
        }
      },
    }),

    getCurrentUser: builder.query({
      query: () => "/auth/google/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;
