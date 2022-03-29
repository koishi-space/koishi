import auth from "../services/authService";
// import { Redirect } from "react-router-dom";

const LogoutRoute = () => {
    auth.logout();
    window.location = "/";
    return null;
}

export default LogoutRoute;