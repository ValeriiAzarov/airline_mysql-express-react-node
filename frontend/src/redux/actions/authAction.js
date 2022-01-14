import ACTIONS from "./index.js";
import axios from "axios";

const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    };
};

const fetchUser = async (token) => {
    const result = await axios.get("http://localhost:5000/api/users/info", {
        headers: {
            Authorization: token
        }
    });
    return result;
};

const dispatchGetUser = (result) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            user: result.data[0],
            isAdmin: result.data[0].role === 1 ? true : false
        }
    };
};

export { 
    dispatchLogin, 
    fetchUser, 
    dispatchGetUser
};
