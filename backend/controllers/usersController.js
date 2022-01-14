import db from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmailValid from "../utils/validation/validation.js";
import sendMail from "./sendMail.js";

const registerUser = (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (!name || !email || !password || !confPassword) {
        return res.status(400).send({
            message: "Please fill in all fields."
        });
    }
    if (!isEmailValid(email)) {
        return res.status(400).send({
            message: "Invalid email."
        });
    }
    if (!password || password.length < 5) {
        return res.status(400).send({ 
            message: "Password must be at least 5 characters."
        });
    }
    if (password != confPassword) {
        return res.status(400).send({ 
            message: "Both passwords must match."
        });
    }
    db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email], (err, data) => {
        if (data.length) {
            return res.status(400).send({
                message: "This email already exists."
            });
        }
        else {
            const salt = bcrypt.genSalt();
            bcrypt.hash(password, parseInt(salt), (err, encryptedPassword) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message
                    });
                }
                else {
                    const activationToken = jwt.sign({
                        name: name,
                        email: email,
                        password: encryptedPassword
                    }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: "60m" // 1 час
                    });
                    sendMail(
                        email,
                        "Verify Email Address", 
                        `http://localhost:3000/activate/${activationToken}`, 
                        "Please click the button below to verify your email adress. This link will expire in 1 hour.",
                        "VERIFY EMAIL"
                    );
                    return res.status(200).send({
                        message: "Register Success! Please activate your email to start."
                    });
                }
            });
        }
    });    
};

const activateAccount = (req, res) => {
    const { activationToken } = req.body;
    jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({
                message: "Unfortunately the activation period has expired."
            });
        }
        db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [decoded.email], (err, data) => {
            if (data.length > 0) {
                return res.status(400).send({
                    message: "This email already exists."
                });
            }
            else {
                db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 0)",
                [decoded.name, decoded.email, decoded.password], (err, data) => {
                    if (err) {
                        return res.status(500).send({ 
                            message: err.message 
                        });
                    }
                    else {
                        return res.status(201).send({ 
                            message: "Account has been activated!"
                        });
                    }
                });
            }
        });
    });
};

const forgotPassword = (req, res) => {
    const { email } = req.body;
    db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email], (err, data) => {
        if (!data.length) {
            return res.status(400).send({
                message: "This email does not exist."
            });
        }
        else {
            const accessToken = jwt.sign({
                id: data[0].id
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "30m" // 30 минут
            });
            sendMail(
                email,
                "Reset Your Password", 
                `http://localhost:3000/reset/${accessToken}`, 
                "You are receiving this email because we receied a password reset request for your account. This link will expire in 30 minutes.",
                "RESET PASSWORD"
            );
            return res.status(200).send({
                message: "Re-send the password, please check your email."
            });
        }
    });
};

const resetPassword = (req, res) => {
    const { password } = req.body;
    const salt = bcrypt.genSalt();
    bcrypt.hash(password, parseInt(salt), (err, encryptedPassword) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }
        else {
            db.query("UPDATE users SET password = ? WHERE id = ?", [encryptedPassword, req.user.id]); 
            return res.status(200).send({
                message: "Password successfully changed!"
            });             
        }
    });
};

const login = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({
            message: "Please enter email and password."
        });
    } 
    else {
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
            if (err) {
                return res.status(500).send({ 
                    message: err.message
                });
            }
            if (data.length > 0) {
                if (!bcrypt.compareSync(password, data[0].password)) {
                    return res.status(400).send({
                        message: "Password is incorrect."
                    });
                } 
                else {
                    const refreshToken = jwt.sign({
                        id: data[0].id
                    }, 
                    process.env.REFREAH_TOKEN_SECRET, {
                        expiresIn: "7d"
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 день
                    });
                    return res.status(200).send({
                        message: "Login success!"
                    });       
                }
            }
            else {
                return res.status(400).send({
                    message: "This email does not exist."
                });                
            }
        });
    }
};

const getAccessToken = (req, res) => {
    const refreshToken  = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).send({
            message: "Please login now."
        });
    }
    jwt.verify(refreshToken, process.env.REFREAH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({
            id: decoded.id
        },
        process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "60m" // 1 час
        });
        return res.status(200).send({ 
            accessToken
        });
    });
};

const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }
    res.clearCookie("refreshToken");
    return res.status(200).send({
        message: "Logged out."
    });   
};

const getUser = (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, data) => {
        if (err) {
            return res.status(500).send({ 
                message: err.message
            });
        }
        else {
            return res.status(200).send(data);
        }
    });
};

const getAllUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, data) => {
        if (err) {
            return res.status(500).send({ 
                message: err.message
            });
        }
        else {
            return res.status(200).send(data);
        }
    });
};
 
export { 
    registerUser,
    activateAccount,
    forgotPassword,
    resetPassword,
    login,
    logout,
    getAccessToken,
    getUser,
    getAllUsers
};