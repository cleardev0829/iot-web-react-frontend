import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const counterAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = counterAdapter.getSelectors(
	state => state.productApp.counter
);

const refreshSlice = createSlice({
	name: 'productApp/product',
	initialState: {
		counter: 0
	},
	reducers: {
		refresh: {
			reducer: (state, action) => {
				state.counter = state.counter + 1;
			}
		}
	}
});

export const { refresh } = refreshSlice.actions;

export default refreshSlice.reducer;
