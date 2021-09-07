import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUsers = createAsyncThunk('errorsApp/users/getUsers', async () => {
	const response = await axios.get('/api/product-app/users');
	const data = await response.data;

	return data;
});

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUserById } = usersAdapter.getSelectors(
	state => state.errorsApp.users
);

const usersSlice = createSlice({
	name: 'errorsApp/users',
	initialState: usersAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getUsers.fulfilled]: usersAdapter.setAll
	}
});

export default usersSlice.reducer;
