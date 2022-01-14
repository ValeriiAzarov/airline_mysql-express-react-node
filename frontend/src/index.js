import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import DataProvider from "./redux/store.js";

ReactDOM.render(
  <DataProvider>
    <App />
  </DataProvider>,
  document.getElementById('root')
);