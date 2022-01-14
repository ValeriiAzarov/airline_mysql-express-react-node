import React, {useEffect} from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/header/Header.jsx";
import Body from "./components/body/Body.jsx";
import { useDispatch, useSelector } from "react-redux";
import { 
  dispatchLogin, 
  fetchUser, 
  dispatchGetUser 
} from "./redux/actions/authAction.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const result = await axios.post("http://localhost:5000/api/users/refresh_token", null);
        dispatch({
          type: "GET_TOKEN", 
          payload: result.data.accessToken
        });
      }
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then(result => {
          dispatch(dispatchGetUser(result));
        });
      }
      getUser();
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Route>
        <Header/>
        <Body/>
        <ToastContainer/>
      </Route>
    </BrowserRouter>
  );
}

export default App;