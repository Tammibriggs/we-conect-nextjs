import { api } from "./api";

const messagingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchForChat: builder.query({
      query: (query) => `chat/search?query=${query}`,
    }),
    getConversations: builder.query({
      query: () => `chat/conversations`,
      providesTags: ["Conversations"],
    }),
    createConversation: builder.mutation({
      query: ({ receiverId }) => ({
        url: "chat/conversations",
        method: "POST",
        body: {
          receiverId,
        },
      }),
      invalidatesTags: ["Conversations"],
    }),
    getMessages: builder.query({
      query: ({ conversationId, skip, limit }) =>
        `chat/messages/${conversationId}?${limit ? `limit=${limit}&` : ""}${
          skip ? `skip=${skip}&` : ""
        }`,
    }),
    getLatestMessage: builder.query({
      query: ({ coversationId }) => `chat/messages/${coversationId}/message`,
    }),
    addMessage: builder.mutation({
      query: ({ conversationId, sender, text }) => ({
        url: "chat/messages",
        method: "POST",
        body: {
          conversationId,
          sender,
          text,
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazySearchForChatQuery,
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
  useLazyGetMessagesQuery,
  useGetLatestMessageQuery,
} = messagingApi;
