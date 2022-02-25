import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FuseUtils from "@fuse/utils";
import uploadFileToBlob, {
  deleteBlobInContainer,
  getBlobsInContainer,
  getBlobsInContainer1,
} from "app/utils/azure-storage-blob";
import _ from "lodash";
import path from "path";

export const getBlobFiles = createAsyncThunk(
  "tableauApp/resource/getBlobFiles",
  async (params) => {
    const { containerName } = params;
    const data = await getBlobsInContainer(containerName);

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
  "tableauApp/resource/uploadFile",
  async (params, { dispatch, getState }) => {
    const { containerName, file } = params;
    await uploadFileToBlob(containerName, file);

    dispatch(getBlobFiles({ containerName }));
  }
);

const resourceSlice = createSlice({
  name: "tableauApp/resource",
  initialState: null,
  reducers: {
    resetResource: () => null,
  },
  extraReducers: {
    [getBlobFiles.fulfilled]: (state, action) => action.payload,
    [uploadFile.fulfilled]: (state, action) => action.payload,
    [deleteFile.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetResource } = resourceSlice.actions;

export default resourceSlice.reducer;
