import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProducts = createAsyncThunk('errorsApp/products/getProducts', async params => {
	const response = await axios.get('/api/product-app/products-by-user-id', { params });
	const data = await response.data;

	return data;
});

const productsAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = productsAdapter.getSelectors(
	state => state.errorsApp.products
);

const productsSlice = createSlice({
	name: 'errorsApp/products',
	initialState: productsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getProducts.fulfilled]: productsAdapter.setAll
	}
});

export default productsSlice.reducer;
