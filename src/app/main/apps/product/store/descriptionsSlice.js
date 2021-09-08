import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDescriptions = createAsyncThunk('productApp/descriptions/descriptions', async () => {
	const response = await axios.get('/api/product-app/descriptions');
	const data = await response.data;

	return { data };
});

const descriptionsAdapter = createEntityAdapter({});

export const { selectAll: selectDescriptions, selectById: selectDescriptionById } = descriptionsAdapter.getSelectors(
	state => state.productApp.descriptions
);

const descriptionsSlice = createSlice({
	name: 'productApp/descriptions',
	initialState: descriptionsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getDescriptions.fulfilled]: descriptionsAdapter.setAll
	}
});

export default descriptionsSlice.reducer;
