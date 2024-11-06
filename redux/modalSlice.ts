import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "modal",
  initialState: { isOpen: false },
  reducers: {
    setModalIsOpen: (state, { payload }) => {
      state.isOpen = payload;
    },
  },
});

export const { setModalIsOpen } = slice.actions;

export default slice.reducer;

export const selectModalIsOpen = (state) => state.modal.isOpen;
