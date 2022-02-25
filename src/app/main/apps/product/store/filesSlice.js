import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { makeid } from "app/utils/Functions";
import axios from "axios";
import uploadFileToBlob, {
  getBlobsInContainer,
  deleteBlobInContainer,
  downloadBlobFromContainer,
} from "../../../../utils/azure-storage-blob";

export const getFiles = createAsyncThunk(
  "productApp/files/getFiles",
  async (params) => {
    const response = await axios.get(
      "/api/file-manager-app/files/getByLiftId",
      {
        params,
      }
    );

    const data = response.data;
    return data;
  }
);

export const getBlobFiles = createAsyncThunk(
  "productApp/files/getBlobFiles",
  async (params) => {
    const { containerName } = params;
    const data = await getBlobsInContainer(containerName);

    return data;
  }
);

export const deleteFile = createAsyncThunk(
  "productApp/files/deleteFile",
  async (params) => {
    const { containerName, fileName, id } = params;

    await axios.post("/api/file-manager-app/files/remove-file", {
      id: id,
    });

    const data = await deleteBlobInContainer(containerName, fileName);

    return data;
  }
);

export const uploadFile = createAsyncThunk(
  "productApp/files/uploadFile",
  async (params) => {
    const { containerName, file, lift } = params;
    const url = await uploadFileToBlob(containerName, file);

    const response = await axios.post("/api/file-manager-app/files/save", {
      uid: makeid(30),
      liftId: lift.productId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: url,
    });

    const data = await response.data;
    return data;
  }
);

export const downloadFile = createAsyncThunk(
  "productApp/files/downloadFile",
  async (params) => {
    const { containerName, file } = params;
    const data = await downloadBlobFromContainer(containerName, file);

    return data;
  }
);

const filesAdapter = createEntityAdapter({});

export const {
  selectAll: selectFiles,
  selectEntities: selectFilesEntities,
  selectById: selectFileById,
} = filesAdapter.getSelectors((state) => state.productApp.files);

const filesSlice = createSlice({
  name: "productApp/files",
  initialState: filesAdapter.getInitialState({
    selectedItemId: null,
  }),
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
  },
  extraReducers: {
    [getFiles.fulfilled]: filesAdapter.setAll,
  },
});

export const { setSelectedItem } = filesSlice.actions;

export default filesSlice.reducer;
