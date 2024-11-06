import { api } from "./api";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkUsername: builder.mutation({
      query: (payload) => ({
        url: "auth/check-username",
        body: payload,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCheckUsernameMutation } = authApi;
