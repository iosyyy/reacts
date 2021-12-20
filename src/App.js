import React, { Fragment, Suspense, lazy, useEffect } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { HashRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import Pace from "./shared/components/Pace";
import axios from "axios";
import cookie from "react-cookies";

const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));
const requestAuthorization = (request) => {
  // console.log("axios request拦截器");
  const user = cookie.load("user");
  if (user) {
    // console.log("加响应头");
    request.headers.Authorization = user.token;
    return request;
  } else {
    return request;
  }
};
const toEnd = () => {
  cookie.remove("user", "/");
  cookie.remove("user", "/c");
  window.location.href = "/#";
};
// request拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      toEnd();
      return error.response.data;
    } else if (error.response.status === 404) {
      toEnd();
      return error.response.data;
    }
    if (error.response.status === 504) {
      toEnd();
      return error.response.data;
    }
    Promise.reject(error);
  }
);
axios.interceptors.request.use(
  (config) => {
    requestAuthorization(config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
function App() {
  useEffect(() => {
    const user = cookie.load("user");
    console.log(user);
    if (
      user &&
      window.location.href !== "http://localhost:3000/#/c/dashboard"
    ) {
      window.location.href = "/#/c/dashboard";
    }
  });
  return (
    <HashRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Pace color={theme.palette.primary.light} />
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/c">
              <LoggedInComponent />
            </Route>
            <Route>
              <LoggedOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </HashRouter>
  );
}

export default App;
