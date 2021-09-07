import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const errorsAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = errorsAdapter.getSelectors(
	state => state.errorsApp.dialog
);

const dialogSlice = createSlice({
	name: 'errorsApp/dialog',
	initialState: errorsAdapter.getInitialState({		
		messageInfoDialog: {
			type: 'edit',
			props: {
				open: false
			},
			data: null
		},		
	}),
	reducers: {		
		openMessageInfoDialog: (state, action) => { 
			state.messageInfoDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMessageInfoDialog: (state, action) => {
			state.messageInfoDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},	
	},
	extraReducers: {}
});

export const { 	
	openMessageInfoDialog,
	closeMessageInfoDialog ,	
} = dialogSlice.actions;

export default dialogSlice.reducer;
