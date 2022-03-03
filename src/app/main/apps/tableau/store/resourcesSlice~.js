import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FuseUtils from "@fuse/utils";
import uploadFileToBlob, {
  deleteBlobInContainer,
} from "app/utils/azure-storage-blob";
import _ from "lodash";
import path from "path";
import axios from "axios";

export const getFolders = createAsyncThunk(
  "tableauApp/resource/getFolders",
  async () => {
    const response = await axios.get("/api/tableau-app/folders", {});
    const data = await response.data;

    return data;
  }
);

export const getBlobFiles = createAsyncThunk(
  "tableauApp/resource/getBlobsInContainer",
  async (params) => {
    const { containerName } = params;
    const response = await axios.post("/api/tableau-app/getBlobsInContainer", {
      containerName,
    });
    const data = await response.data;

    const _data = _.filter(
      data,
      (item) => path.extname(item.blobUrl) !== ".json"
    );

    return {
      id: FuseUtils.generateGUID(),
      name: containerName,
      featuredImageId: -1,
      images: _data,
    };
  }
);

export const deleteFile = createAsyncThunk(
  "tableauApp/resource/deleteFile",
  async (params, { dispatch, getState }) => {
    const { containerName, fileName } = params;
    await deleteBlobInContainer(containerName, fileName);
    if (containerName === "tableau-templates") {
      await deleteBlobInContainer(
        containerName,
        `${fileName.replace(/\.[^/.]+$/, "")}.json`
      );
    }
    dispatch(getBlobFiles({ containerName }));
  }
);

export const uploadFile = createAsyncThunk(
  "tableauApp/resource/uploadBlobInContainer",
  async (params, { dispatch, getState }) => {
    const { containerName, file } = params;
    await uploadFileToBlob(containerName, file);

    dispatch(getBlobFiles({ containerName }));
  }
);

// export const {
//   selectAll: selectFolders,
//   selectById: selectFoldersById,
// } = foldersAdapter.getSelectors((state) => state.tableauApp.folders);

const resourceSlice = createSlice({
  name: "tableauApp/resource",
  initialState: [],
  reducers: {
    resetResource: () => [],
  },
  extraReducers: {
    [getBlobFiles.fulfilled]: (state, action) => action.payload,
    [uploadFile.fulfilled]: (state, action) => action.payload,
    [deleteFile.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetResource } = resourceSlice.actions;

export default resourceSlice.reducer;
