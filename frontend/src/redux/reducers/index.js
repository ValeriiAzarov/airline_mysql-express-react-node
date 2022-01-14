import { combineReducers } from "redux";
import auth from "./authReducer.js";
import token from "./tokenReducer.js";
import users from "./usersReducer.js";

export default combineReducers({
    auth,
    token,
    users
});