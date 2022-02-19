import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Route, Switch, Redirect } from "react-router-dom";
import auth from "./services/authService";
import AuthRoute from "./routes/authRoute";
import PublicNavbar from "./components/common/publicNavbar/publicNavbar";
import HomePage from "./pages/home/homePage";
import LoginPage from "./pages/login/loginPage";
import VerifyPage from "./pages/verify/verifyPage";
import AppRouter from "./pages/app/appRouter";
import NotFoundPage from "./pages/default/notFoundPage";
import ForbiddenPage from "./pages/default/forbiddenPage";
import LogoutRoute from "./routes/logoutRoute";
import RegisterPage from "./pages/register/registerPage";
import ProfilePage from "./pages/profile/profilePage";

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
    const { user } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <PublicNavbar user={user} />
        <main>
          <Switch>
            {/* Main routes */}
            <Route path="/" exact component={HomePage} />
            <AuthRoute path="/app" component={AppRouter} />

            {/* Account control routes */}
            <Route path="/login" component={LoginPage} />
            <Route path="/logout" component={LogoutRoute} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/verify" component={VerifyPage} />
            <Route path="/profile" component={ProfilePage} />

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
