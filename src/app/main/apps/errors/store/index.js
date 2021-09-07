import { combineReducers } from '@reduxjs/toolkit';
import dialog from './dialogSlice';
import messages from './messagesSlice';
import users from './usersSlice';
import products from './productsSlice';

const reducer = combineReducers({
	dialog,
	messages,
	users,
	products
});

export default reducer;
