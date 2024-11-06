import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import modal from "./modalSlice";
import chat from "./chatSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [api.reducerPath]: api.reducer,
    modal,
    chat,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
