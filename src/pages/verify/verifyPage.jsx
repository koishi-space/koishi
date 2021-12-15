import React, { Component } from "react";
import * as auth from "../../services/authService";
import * as usersService from "../../services/api/usersService";
import { Link, Redirect } from "react-router-dom";
import "./verifyPage.css";
import Spinner from "../../components/common/spinner/spinner";
import Button from "../../components/common/button/button";

class VerifyPage extends Component {
  state = {
    verified: false,
    verificationError: null,
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    const query = this.props.location.search;
    const code = new URLSearchParams(query).get("token");

    if (user && code && !this.state.verified) this.verifyUser(code);
  }

  verifyUser = (code) => {
    usersService
      .verifyUser(code)
      .then((x) => {
        this.setState({ verified: true });
        auth.loginWithJwt(x.data);
      })
      .catch((ex) => {
        if (ex.response && ex.response.status >= 400)
          this.setState({
            verified: true,
            verificationError: ex.response.data,
          });
      });
  };

  render() {
    const user = auth.getCurrentUser();
    const query = this.props.location.search;
    const code = new URLSearchParams(query).get("token");

    return (
      <div className="view main">
        <div className="verify-card">
          {/* If there is a token in URL, user is trying to verify himself */}
          {code ? (
            // Is verification in progress?
            this.state.verified ? (
              // User verification was performed - was it successful?
              this.state.verificationError ? (
                <React.Fragment>
                  <h1>Verification failed</h1>
                  <p style={{ color: "red" }}>{this.state.verificationError}</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h1>Verified!</h1>
                  <p>
                    You have successfully verified your account! Lets start
                    using Koishi!
                  </p>
                  <Link to="/dashboard">
                    <Button text="Go to dashboard!" />
                  </Link>
                </React.Fragment>
              )
            ) : (
              <React.Fragment>
                <h1>Verifying new account...</h1>
                <Spinner />
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              <h1>Verify new account</h1>
              <p>
                We've sent a verification email to {user.email}!
                <br />
                <b>You can close this page</b>
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default VerifyPage;
