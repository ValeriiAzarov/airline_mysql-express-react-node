import ACTIONS from "./index.js";
import axios from "axios";

const fetchAllUsers = async (token) => {
    const result = await axios.get("http://localhost:5000/api/users/all_info", {
        headers: {
            Authorization: token
        }
    });
    return result;
};

const dispatchGetAllUsers = (result) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: result.data
    };
};

export {
    fetchAllUsers,
    dispatchGetAllUsers
};