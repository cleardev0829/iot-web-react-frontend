import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { HEROKU_API_URL } from 'app/fuse-configs/endpointConfig';
import axios from 'axios';

export const getServicers = createAsyncThunk('productApp/servicers/getServicers', async () => {
	const response = await axios.get('/api/servicers-app/servicers');
	const data = await response.data;

	return data;
});

export const sendMessage = createAsyncThunk(
	'productApp/servicers/sendMessage',
	async (form, { dispatch, getState }) => {
		const mailForm = {
			email: form.email,
			subject: form.subject,
			emailBody: form.message
		};

		const smsForm = {
			phone: form.phone,
			message: form.message
		};

		await axios
			.post(`${HEROKU_API_URL}/email/sendSMSOverHTTP`, smsForm)
			.then(response => {
				return response;
			})
			.catch(error => {
				return error;
			});

		await axios
			.post(`${HEROKU_API_URL}/email/sendMailOverHTTP`, mailForm)
			.then(response => {
				return response;
			})
			.catch(error => {
				return error;
			});
	}
);

const servicersAdapter = createEntityAdapter({});

export const { selectAll: selectServicers, selectById: selectServicerById } = servicersAdapter.getSelectors(
	state => state.productApp.servicers
);

const servicersSlice = createSlice({
	name: 'productApp/servicers',
	initialState: servicersAdapter.getInitialState({}),

	reducers: {},
	extraReducers: {
		[getServicers.fulfilled]: servicersAdapter.setAll
	}
});

export default servicersSlice.reducer;
