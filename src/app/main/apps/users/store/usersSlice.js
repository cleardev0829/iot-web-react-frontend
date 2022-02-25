import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  // API_URL,
  HEROKU_API_URL,
  deployEndpoint,
} from "app/fuse-configs/endpointConfig";
import { showMessage } from "app/store/fuse/messageSlice";

export const getUser = createAsyncThunk(
  "usersApp/users/getUser",
  async (params) => {
    const response = await axios.get("/api/users-app/user", { params });
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const getUsers = createAsyncThunk(
  "usersApp/users/getUsers",
  async () => {
    const response = await axios.get("/api/users-app/users");
    const data = await response.data;

    return data;
  }
);

export const saveUser = createAsyncThunk(
  "usersApp/users/saveUser",
  async (form, { dispatch, getState }) => {
    var mailForm = {
      email: form.email,
      subject: "Sent Invitation",
      emailBody: `<div>
				<p>Please touch this link to register to Rocket App as Customer <p>
				<a href='${deployEndpoint}/register/${form.email}/${form.role}'>
					${deployEndpoint}/register/${form.email}/${form.role}
				</a>
			</div>`,
    };

    await axios
      .post("/api/users-app/user/save", form)
      .then(() => {
        axios
          .post(`${HEROKU_API_URL}/email/sendMailOverHTTP`, mailForm)
          .then(() => {
            dispatch(
              showMessage({
                message: "You sent an invitation successfully!",
                variant: "success",
              })
            );
          });
        dispatch(getUsers());
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: err.response.data.message,
            variant: "warning",
          })
        );
      });
  }
);

export const updateUser = createAsyncThunk(
  "usersApp/users/updateUser",
  async (form, { dispatch, getState }) => {
    await axios
      .post("/api/users-app/user/update", form)
      .then(() =>
        dispatch(
          showMessage({ message: "User data updated", variant: "success" })
        )
      );

    dispatch(getUsers());
  }
);

export const removeUsers = createAsyncThunk(
  "usersApp/users/removeUsers",
  async (ids, { dispatch, getState }) => {
    const response = await axios.post("/api/users-app/remove-users", { ids });
    const data = await response.data;
    console.log(data);

    dispatch(getUsers());
  }
);

const usersAdapter = createEntityAdapter({});

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => state.usersApp.users);

const usersSlice = createSlice({
  name: "usersApp/users",
  initialState: usersAdapter.getInitialState({
    searchText: "",
    addUserDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
    userProfileDialog: {
      type: "edit",
      props: {
        open: false,
      },
      data: null,
    },
  }),

  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    openUserDialog: (state, action) => {
      state.addUserDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeUserDialog: (state, action) => {
      state.addUserDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openUserProfileDialog: (state, action) => {
      state.addUserDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeUserProfileDialog: (state, action) => {
      state.addUserDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: usersAdapter.setAll,
  },
});

export const {
  setUsersSearchText,
  openUserDialog,
  closeUserDialog,
  openUserProfileDialog,
  closeUserProfileDialog,
} = usersSlice.actions;

export default usersSlice.reducer;
