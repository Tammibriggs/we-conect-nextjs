import { api } from "./api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "users",
      providesTags: ["Follow", "User"],
    }),
    getUserById: builder.query({
      query: ({ id }) => `users/${id}`,
      providesTags: ["User", "Follow"],
    }),
    getFollowers: builder.query({
      query: () => `users/followers`,
      providesTags: ["Follow"],
    }),
    getFollowing: builder.query({
      query: () => `users/following`,
      providesTags: ["Follow"],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `users`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    follow: builder.mutation({
      query: ({ userId }) => ({
        url: `users/follow`,
        method: "PATCH",
        body: {
          userId,
        },
      }),
      invalidatesTags: ["Follow"],
    }),
    unfollow: builder.mutation({
      query: ({ userId }) => ({
        url: `users/unfollow`,
        method: "PATCH",
        body: {
          userId,
        },
      }),
      invalidatesTags: ["Follow"],
    }),
    searchPeople: builder.query({
      query: (query) => `users/search?search=${query}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowMutation,
  useUnfollowMutation,
  useGetUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useLazySearchPeopleQuery,
} = userApi;
