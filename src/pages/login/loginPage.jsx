import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/forms/loginForm";
import "./loginPage.css";

class LoginPage extends Component {
  render() {
    return <div className="view main">
        <h1>Login</h1>
        <hr />
        <LoginForm />
        <Link style={{marginTop: "5px"}} to="/register">Dont have an account yet? Register.</Link>
    </div>;
  }
}

export default LoginPage;
