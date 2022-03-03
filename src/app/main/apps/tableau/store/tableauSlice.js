import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import path from "path";
import uploadFileToBlob from "app/utils/azure-storage-blob";

export const getBlobsInContainer = createAsyncThunk(
  "tableauApp/folders/getBlobsInContainer",
  async (folder) => {
    const response = await axios.post("/api/tableau-app/getBlobsInContainer", {
      containerName: folder.name,
    });
    const data = await response.data;

    const _data = _.filter(
      data,
      (item) => path.extname(item.blobUrl) !== ".json"
    );

    return _data;
  }
);

export const deleteBlobInContainer = createAsyncThunk(
  "tableauApp/folders/deleteBlobInContainer",
  async (params, { dispatch, getState }) => {
    const { containerName, fileName } = params;
    const response = await axios.post(
      "/api/tableau-app/deleteBlobInContainer",
      { containerName, fileName }
    );
    const data = await response.data;

    dispatch(getBlobsInContainer({ name: containerName }));

    return data;
  }
);

export const uploadBlobInContainer = createAsyncThunk(
  "tableauApp/folders/uploadBlobInContainer",
  async (params, { dispatch, getState }) => {
    const { containerName, file } = params;
    const response = await uploadFileToBlob(containerName, file);
    const data = await response.data;

    dispatch(getBlobsInContainer({ name: containerName }));

    return data;
  }
);

export const listContainersInStorage = createAsyncThunk(
  "tableauApp/folders/listContainersInStorage",
  async () => {
    const response = await axios.post(
      "/api/tableau-app/listContainersInStorage",
      {}
    );
    const data = await response.data;
    const _data = _.filter(
      data,
      (item) =>
        item.name.split("-")[0] === "tableau" &&
        item.name !== "tableau-templates"
    );

    return _data;
  }
);

export const createContainerInStorage = createAsyncThunk(
  "tableauApp/folders/createContainerInStorage",
  async (folder, { dispatch }) => {
    const response = await axios.post(
      "/api/tableau-app/createContainerInStorage",
      {
        containerName: folder.name,
      }
    );
    const data = await response.data;

    dispatch(listContainersInStorage());

    return data;
  }
);

export const deleteContainerInStorage = createAsyncThunk(
  "tableauApp/folders/deleteContainerInStorage",
  async (folder, { dispatch }) => {
    const response = await axios.post(
      "/api/tableau-app/deleteContainerInStorage",
      {
        containerName: folder.name,
      }
    );
    const data = await response.data;

    dispatch(listContainersInStorage());

    return data;
  }
);

export const isExistsContainerInStorage = createAsyncThunk(
  "tableauApp/folders/isExistsContainerInStorage",
  async (folder, { dispatch }) => {
    const response = await axios.post(
      "/api/tableau-app/isExistsContainerInStorage",
      {
        containerName: folder.name,
      }
    );
    const data = await response.data;

    return data;
  }
);

const foldersAdapter = createEntityAdapter({});

export const {
  selectAll: selectFolders,
  selectById: selectFoldersById,
} = foldersAdapter.getSelectors((state) => state.tableauApp.folders);

const foldersSlice = createSlice({
  name: "tableauApp/folders",
  initialState: foldersAdapter.getInitialState({
    selected: null,
    resource: [],
    prefix: "tableau",
    FolderDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setSelected: {
      reducer: (state, action) => {
        state.selected = action.payload;
      },
    },
    resetResource: (state, action) => {
      state.resource = [];
    },
    openNewFolderDialog: (state, action) => {
      state.FolderDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewFolderDialog: (state, action) => {
      state.FolderDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditFolderDialog: (state, action) => {
      state.FolderDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditFolderDialog: (state, action) => {
      state.FolderDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    // [updateFolder.fulfilled]: foldersAdapter.upsertOne,
    [createContainerInStorage.fulfilled]: foldersAdapter.addOne,
    [listContainersInStorage.fulfilled]: foldersAdapter.setAll,
    [getBlobsInContainer.fulfilled]: (state, action) => {
      state.resource = action.payload;
    },
  },
});

export const {
  setSelected,
  resetResource,
  openNewFolderDialog,
  closeNewFolderDialog,
  openEditFolderDialog,
  closeEditFolderDialog,
} = foldersSlice.actions;

export default foldersSlice.reducer;
