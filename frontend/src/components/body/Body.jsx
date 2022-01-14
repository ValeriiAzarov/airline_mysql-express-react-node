import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Home from "../body/home/Home.jsx";
import NotFound from "../utils/notFound/NotFound.jsx";
import { useSelector } from "react-redux";
import ActivationEmail from "./auth/ActivationEmail.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";

const Body = () => {
    const auth = useSelector(state => state.auth);
    const {isLogged, isAdmin} = auth;
    
    return (
        <section>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/login" component={isLogged ? NotFound : Login} exact />
                <Route path="/register" component={isLogged ? NotFound : Register} exact />
                <Route path="/activate/:activationToken" component={ActivationEmail} exact />
                <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPassword} exact />
                <Route path="/reset/:token" component={isLogged ? NotFound : ResetPassword} exact />                
            </Switch>
        </section>
    );
};

export default Body;