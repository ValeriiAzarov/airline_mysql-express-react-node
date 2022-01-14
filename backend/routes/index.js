import express  from "express";
import { 
    registerUser,
    activateAccount,
    forgotPassword,
    resetPassword,
    login,
    logout,
    getAccessToken,
    getUser,
    getAllUsers
} from "../controllers/usersController.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// register
router.post("/users/register", registerUser);
// activate account
router.post("/users/activation", activateAccount);
// forgot password
router.post("/users/forgot", forgotPassword);
// reset
router.post("/users/reset", auth, resetPassword);
// login
router.post("/users/login", login);
// logout
router.get("/users/logout", logout);
// get access token
router.post("/users/refresh_token", getAccessToken);
// get info about user
router.get("/users/info", auth, getUser);
// get info about all users
router.get("/users/all_info", auth, authAdmin, getAllUsers);

export default router;