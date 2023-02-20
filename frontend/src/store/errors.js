import { combineReducers } from "redux";
import { sessionErrorsReducer } from './session';
import tweetsReducer from "./tweets";

export default combineReducers({
    session: sessionErrorsReducer,
    tweets: tweetsReducer
});