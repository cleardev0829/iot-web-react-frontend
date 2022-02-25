import { combineReducers } from "@reduxjs/toolkit";
import resource from "./resourcesSlice";
// import templates from './templatesSlice';
import dialog from "./dialogSlice";

const reducer = combineReducers({
  resource,
  //   templates,
  dialog,
});

export default reducer;
