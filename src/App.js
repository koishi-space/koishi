import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Switch, Redirect } from "react-router-dom";
import auth from "./services/authService";
import AuthRoute from "./routes/authRoute";
import PublicNavbar from "./components/common/publicNavbar/publicNavbar";
import HomePage from "./pages/home/homePage";
import LoginPage from "./pages/login/loginPage";
import VerifyPage from "./pages/verify/verifyPage";
import DashboardPage from "./pages/dashboard/dashboardPage";
import NotFoundPage from "./pages/default/notFoundPage";
import ForbiddenPage from "./pages/default/forbiddenPage";

class App extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    if (!process.env.REACT_APP_JWTPK) throw new Error("JWTPK is not set!");
    if (!process.env.REACT_APP_API_URL) throw new Error("API_URL is not set!");

    return (
      <React.Fragment>
        <ToastContainer />
        <PublicNavbar />
        <main>
          <Switch>
            {/* Main routes */}
            <Route path="/" exact component={HomePage} />
            <AuthRoute path="/dashboard" component={DashboardPage} />

            {/* Account control routes */}
            <Route path="/login" component={LoginPage} />
            <Route path="/verify" component={VerifyPage} />

            {/* Sink routes */}
            <Route path="/forbidden" component={ForbiddenPage} />
            <Route path="/not-found" component={NotFoundPage} />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}
export default App;
