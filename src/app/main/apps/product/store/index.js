import { combineReducers } from '@reduxjs/toolkit';
import product from './productSlice';
import products from './productsSlice';
import dialog from './dialogSlice';
import messages from './messagesSlice';
import users from './usersSlice';
import filters from './filtersSlice';
import folders from './foldersSlice';
import labels from './labelsSlice';
import descriptions from './descriptionsSlice';
import files from './filesSlice';

const reducer = combineReducers({
	products,	
	product,
	dialog,
	messages,
	users,
	folders,
	labels,
	filters,
	descriptions,
	files
});

export default reducer;
