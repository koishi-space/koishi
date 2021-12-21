import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../../components/forms/registerForm";

class RegisterPage extends React.Component {
  render() {
    return (
      <div className="view main">
        <h1>Register</h1>
        <hr />
        <RegisterForm />
        <Link style={{ marginTop: "5px" }} to="/login">
          Already have an account? Login.
        </Link>
      </div>
    );
  }
}

export default RegisterPage;
