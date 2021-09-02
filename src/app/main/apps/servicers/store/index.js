import { combineReducers } from '@reduxjs/toolkit';

import servicers from './servicersSlice';
import products from './productsSlice';

const reducer = combineReducers({
	servicers,
	products,
});

export default reducer;
