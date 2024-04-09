import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk";
import rootReducer from "./reducers"

// DEV TOOLS
import { composeWithDevTools } from "@redux-devtools/extension";//google extension
import { logger } from "redux-logger";//console dev

// Ancienne méthode => corriger par plus récente !!!
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
