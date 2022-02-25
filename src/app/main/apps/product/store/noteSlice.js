import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import uploadFileToBlob, {
  deleteBlobInContainer,
} from "../../../../utils/azure-storage-blob";
import { refresh } from "./refreshSlice";

export const getNotes = createAsyncThunk(
  "productApp/notes/getNotes",
  async (params) => {
    const response = await axios.get("/api/notes-app/notes/getByMessageId", {
      params,
    });

    const data = response.data;
    return data;
  }
);

export const saveNote = createAsyncThunk(
  "productApp/notes/saveNote",
  async (notes, { dispatch, getState }) => {
    const response = await axios.post("api/product-app/message/update", {
      ...notes,
    });
    const data = await response.data;

    await dispatch(refresh());

    return data;
  }
);

export const updateNote = createAsyncThunk(
  "productApp/notes/updateNote",
  async (notes, { dispatch, getState }) => {
    return [];
  }
);

export const removeNote = createAsyncThunk(
  "productApp/notes/removeNote",
  async (notes, { dispatch, getState }) => {
    const response = await axios.post("api/product-app/message/update", {
      ...notes,
    });
    const data = await response.data;

    dispatch(refresh());

    return data;
  }
);

export const uploadFile = createAsyncThunk(
  "productApp/notes/uploadFile",
  async (params) => {
    const { containerName, file } = params;
    const data = await uploadFileToBlob(containerName, file);

    return data;
  }
);

export const deleteFile = createAsyncThunk(
  "productApp/notes/deleteFile",
  async (params) => {
    const { containerName, fileName } = params;
    const data = await deleteBlobInContainer(containerName, fileName);

    return data;
  }
);

const notesAdapter = createEntityAdapter({});

export const {
  selectAll: selectNotes,
  selectById: selectNotesById,
} = notesAdapter.getSelectors((state) => state.productApp.notes);

const notesSlice = createSlice({
  name: "productApp/notes",
  initialState: notesAdapter.getInitialState({
    noteDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    openNewNoteDialog: (state, action) => {
      state.noteDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeNewNoteDialog: (state, action) => {
      state.noteDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditNoteDialog: (state, action) => {
      state.noteDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditNoteDialog: (state, action) => {
      state.noteDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateNote.fulfilled]: notesAdapter.upsertOne,
    [saveNote.fulfilled]: notesAdapter.addOne,
    [getNotes.fulfilled]: notesAdapter.setAll,
  },
});

export const {
  openNewNoteDialog,
  closeNewNoteDialog,
  openEditNoteDialog,
  closeEditNoteDialog,
} = notesSlice.actions;

export default notesSlice.reducer;
