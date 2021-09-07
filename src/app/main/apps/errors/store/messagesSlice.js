import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getMessages = createAsyncThunk('errorsApp/messages/getMessages', async params => {
	const response = await axios.get('/api/product-app/last-messages', { params });
	const data = await response.data;

	return data;
});

const messagesAdapter = createEntityAdapter({});

export const { selectAll: selectMessages, selectById: selectMessageById } = messagesAdapter.getSelectors(
	state => state.errorsApp.messages
);

const messagesSlice = createSlice({
	name: 'errorsApp/messages',
	initialState: messagesAdapter.getInitialState({
		searchText: 'error'
	}),
	reducers: {
		setMessagesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getMessages.fulfilled]: messagesAdapter.setAll
	}
});

export const { setMessagesSearchText } = messagesSlice.actions;

export default messagesSlice.reducer;
