import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const productAdapter = createEntityAdapter({});

export const {
  selectAll: selectProducts,
  selectById: selectProductById,
} = productAdapter.getSelectors((state) => state.tableauApp.dialog);

const dialogSlice = createSlice({
  name: "tableauApp/dialog",
  initialState: productAdapter.getInitialState({
    resourceImage: null,
  }),
  reducers: {
    openImageDialog: (state, action) => {
      state.resourceImage = action.payload;
    },
    closeImageDialog: (state, action) => {
      state.resourceImage = action.null;
    },
  },
  extraReducers: {},
});

export const { openImageDialog, closeImageDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
