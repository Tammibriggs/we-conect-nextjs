import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "chat",
  initialState: { openedChatsMessages: {}, onlineUsers: {}, conversations: [] },
  reducers: {
    setOnlineUsers: (state, { payload }) => {
      state.onlineUsers = payload;
    },
    setOpenedChatsMessages: (state, { payload }) => {
      state.openedChatsMessages = payload;
    },
    setConversations: (state, { payload }) => {
      state.conversations = payload;
    },
  },
});

const { setOnlineUsers, setOpenedChatsMessages, setConversations } =
  slice.actions;

const selectChat = (state) => state.chat;
const selectOnlineUsers = (state) => state.chat.onlineUsers;
const selectConversations = (state) => state.chat.conversations;

export {
  setOnlineUsers,
  setOpenedChatsMessages,
  setConversations,
  selectChat,
  selectOnlineUsers,
  selectConversations,
};

export default slice.reducer;
