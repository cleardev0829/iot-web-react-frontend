import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getServicer = createAsyncThunk('servicersApp/servicers/getServicer', async params => {
	const response = await axios.get('/api/servicers-app/servicer', { params });
	const data = await response.data;

	return data === undefined ? null : data;
});

export const getServicers = createAsyncThunk('servicersApp/servicers/getServicers', async () => {
	const response = await axios.get('/api/servicers-app/servicers');
	const data = await response.data;

	return data;
});

export const saveServicer = createAsyncThunk(
	'servicersApp/servicers/saveServicer',
	async (form, { dispatch, getState }) => {
		await axios
			.post('/api/servicers-app/servicer/save', form)
			.then(() => {
				dispatch(showMessage({ message: 'Service man data Saved successfully', variant: 'success' }));
				dispatch(getServicers());
			})
			.catch(err => {
				dispatch(showMessage({ message: err.response.data.message, variant: 'warning' }));
			});
	}
);

export const updateServicer = createAsyncThunk(
	'servicersApp/servicers/updateServicer',
	async (form, { dispatch, getState }) => {
		await axios.post('/api/servicers-app/servicer/update', form).then(() => {
			dispatch(showMessage({ message: 'Service man data updated', variant: 'success' }));
			dispatch(getServicers());
		});
	}
);

export const removeServicers = createAsyncThunk(
	'servicersApp/servicers/removeServicers',
	async (ids, { dispatch, getState }) => {
		const response = await axios.post('/api/servicers-app/remove-servicers', { ids });
		const data = await response.data;
		console.log(data);

		dispatch(getServicers());
	}
);

const servicersAdapter = createEntityAdapter({});

export const { selectAll: selectServicers, selectById: selectServicerById } = servicersAdapter.getSelectors(
	state => state.servicersApp.servicers
);

const servicersSlice = createSlice({
	name: 'servicersApp/servicers',
	initialState: servicersAdapter.getInitialState({
		searchText: '',
		addServicerDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		},
		servicerProfileDialog: {
			type: 'edit',
			props: {
				open: false
			},
			data: null
		}
	}),

	reducers: {
		setServicersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openServicerDialog: (state, action) => {
			state.addServicerDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeServicerDialog: (state, action) => {
			state.addServicerDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openServicerProfileDialog: (state, action) => {
			state.addServicerDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeServicerProfileDialog: (state, action) => {
			state.addServicerDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[getServicers.fulfilled]: servicersAdapter.setAll
	}
});

export const {
	setServicersSearchText,
	openServicerDialog,
	closeServicerDialog,
	openServicerProfileDialog,
	closeServicerProfileDialog
} = servicersSlice.actions;

export default servicersSlice.reducer;
