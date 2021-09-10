import { combineReducers } from '@reduxjs/toolkit';
import product from './productSlice';
import refresh from './refreshSlice';
import products from './productsSlice';
import dialog from './dialogSlice';
import messages from './messagesSlice';
import users from './usersSlice';
import filters from './filtersSlice';
import folders from './foldersSlice';
import labels from './labelsSlice';
import descriptions from './descriptionsSlice';
import files from './filesSlice';
import notes from './noteSlice';
import servicers from './servicersSlice';

const reducer = combineReducers({
	products,	
	product,
	refresh,
	dialog,
	messages,
	users,
	folders,
	labels,
	filters,
	descriptions,
	files,
	notes,
	servicers,
});

export default reducer;
