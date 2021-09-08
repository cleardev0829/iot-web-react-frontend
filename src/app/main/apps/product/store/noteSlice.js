import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { makeid } from 'app/utils/Functions';
import axios from 'axios';
import uploadFileToBlob, {
	getBlobsInContainer,
	deleteBlobInContainer,
	downloadBlobFromContainer
} from '../../../../utils/azure-storage-blob';

export const getNotes = createAsyncThunk('productApp/notes/getNotes', async params => {
	const response = await axios.get('/api/notes-app/notes/getByMessageId', {
		params
	});

	const data = response.data;
	return data;
});

export const addNote = createAsyncThunk('productApp/notes/addNote', async (form) => {
	// let url = "";

	// if(form.file) {
	// 	url = 
	// 	await uploadFileToBlob({...form.file, name: })
	// }

	const response = await axios.post('/api/notes-app/notes/save', {
		uid: makeid(30),
		url: '',
		...form
	});

	const data = await response.data;
	return data;
});

export const updateNote = createAsyncThunk('productApp/notes/updateNote', async (note, { dispatch, getState }) => {
	const response = await axios.post('/api/notes-app/update', note);
	const data = await response.data;

	dispatch(getNotes());

	return data;
});

export const removeNote = createAsyncThunk('productApp/notes/removeNote', async (noteId, { dispatch, getState }) => {
	const response = await axios.post('/api/notes-app/remove', noteId);
	const data = await response.data;

	dispatch(getNotes());

	return data;
});

const notesAdapter = createEntityAdapter({});

export const { selectAll: selectNotes, selectById: selectNotesById } = notesAdapter.getSelectors(
	state => state.productApp.notes
);

const notesSlice = createSlice({
	name: 'productApp/notes',
	initialState: notesAdapter.getInitialState({
		searchText: '',
		orderBy: '',
		orderDescending: false,
		routeParams: {},
		noteDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setNotesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		toggleOrderDescending: (state, action) => {
			state.orderDescending = !state.orderDescending;
		},
		changeOrder: (state, action) => {
			state.orderBy = action.payload;
		},
		openNewNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeNewNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: action.payload
			};
		}
	},
	extraReducers: {
		[updateNote.fulfilled]: notesAdapter.upsertOne,
		[addNote.fulfilled]: notesAdapter.addOne,
		[getNotes.fulfilled]: notesAdapter.setAll
	}
});

export const {
	setNotesSearchText,
	toggleOrderDescending,
	changeOrder,
	openNewNoteDialog,
	closeNewNoteDialog,
	openEditNoteDialog,
	closeEditNoteDialog
} = notesSlice.actions;

export default notesSlice.reducer;
