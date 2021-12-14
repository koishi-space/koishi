import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../services/authService";
import * as jwt from "jsonwebtoken";

const AuthRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // Check if there is someone registered
        if (!auth.getCurrentUser()) {
          console.log("no token");

          return <Redirect to="/login" />;
        }
        // There is some token in localStorage, so lastly check its validity
        try {
          jwt.verify(auth.getJwt(), process.env.REACT_APP_JWTPK);
          if (auth.getCurrentUser().status !== "verified")
            return <Redirect to="/verify" />;
          return Component ? <Component {...props} /> : render(props);
        } catch (ex) {
          console.log("Invalid token");
          auth.logout();
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default AuthRoute;
