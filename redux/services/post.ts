import { api } from "./api";

const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ postId }) => `posts/${postId}`,
      providesTags: ["POST"],
    }),
    getTimelinePost: builder.query({
      query: ({ page }) => `posts/timeline?${page ? `page=${page}&` : ""}`,
    }),
    getPosts: builder.query({
      query: ({ userId }) => `posts?userId=${userId}`,
    }),
    createPost: builder.mutation({
      query: ({ userId, desc, img }) => ({
        url: `posts`,
        method: "POST",
        body: {
          userId,
          desc,
          img,
        },
      }),
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
    }),
    likeNdislikePost: builder.mutation({
      query: ({ postId }) => ({
        url: `posts/like/${postId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["POST"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetTimelinePostQuery,
  useLazyGetTimelinePostQuery,
  useGetPostQuery,
  useLikeNdislikePostMutation,
  useDeletePostMutation,
} = postApi;
