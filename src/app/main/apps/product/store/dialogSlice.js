import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const productAdapter = createEntityAdapter({});

export const {
  selectAll: selectProducts,
  selectById: selectProductById,
} = productAdapter.getSelectors((state) => state.productApp.dialog);

const dialogSlice = createSlice({
  name: "productApp/dialog",
  initialState: productAdapter.getInitialState({
    messageInfoDialog: {
      type: "edit",
      props: {
        open: false,
      },
      data: null,
    },
    parameterInfoDialog: {
      type: "edit",
      props: {
        open: false,
      },
      data: null,
    },
    statsInfoDialog: {
      type: "edit",
      props: {
        open: false,
      },
      data: null,
    },
    noteImage: null,
  }),
  reducers: {
    openMessageInfoDialog: (state, action) => {
      state.messageInfoDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeMessageInfoDialog: (state, action) => {
      state.messageInfoDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openParameterInfoDialog: (state, action) => {
      state.parameterInfoDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeParameterInfoDialog: (state, action) => {
      state.parameterInfoDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openStatsInfoDialog: (state, action) => {
      state.statsInfoDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeStatsInfoDialog: (state, action) => {
      state.statsInfoDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openImageDialog: (state, action) => {
      state.noteImage = action.payload;
    },
    closeImageDialog: (state, action) => {
      state.noteImage = action.null;
    },
  },
  extraReducers: {},
});

export const {
  openMessageInfoDialog,
  closeMessageInfoDialog,
  openParameterInfoDialog,
  closeParameterInfoDialog,
  openStatsInfoDialog,
  closeStatsInfoDialog,
  openImageDialog,
  closeImageDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
