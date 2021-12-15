import React, { Component } from "react";
import LoginForm from "../../components/forms/loginForm";
import "./loginPage.css";

class LoginPage extends Component {
  state = {
    loading: true,
    error: null,
  };

  render() {
    return <div className="view main">
        <h1>Login</h1>
        <hr />
        <LoginForm />
    </div>;
  }
}

export default LoginPage;
