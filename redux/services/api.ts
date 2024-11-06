import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SEVER_BASE_URL,
  }),
  tagTypes: ["User", "Follow", "POSTS", "POST", "Conversations"],
  endpoints: () => ({}),
});
