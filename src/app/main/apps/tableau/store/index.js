import { combineReducers } from "@reduxjs/toolkit";
import dialog from "./dialogSlice";
import folders from "./tableauSlice";

const reducer = combineReducers({
  dialog,
  folders,
});

export default reducer;
