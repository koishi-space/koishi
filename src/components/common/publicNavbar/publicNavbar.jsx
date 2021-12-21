import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./publicNavbar.css";
import auth from "../../../services/authService";

const PublicNavbar = ({ user }) => {
  return (
    <div className="navbar">
      <Link className="no-decor" to="/">
        <h1>Koishi</h1>
      </Link>
      <div className="nav">
        <NavLink className="nav-link mg" to="/about">
          About
        </NavLink>
        {auth.getCurrentUser() ? (
          <NavLink className="nav-link mg" to="/app/dashboard">
            App
          </NavLink>
        ) : (
          <NavLink className="nav-link mg" to="/get-started">
            Get started
          </NavLink>
        )}
        <NavLink className="nav-link mg" to="/api">
          API
        </NavLink>
        <NavLink className="nav-link mg" to="/docs">
          Docs
        </NavLink>
        {user ? (
          <div className="dropdown mg">
            <a className="nav-link">
              <b>
                <u>{user.name}</u>
              </b>
            </a>
            <div className="dropdown-content">
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
              <NavLink className="nav-link" to="/logout">
                <u>Log out</u>
              </NavLink>
            </div>
          </div>
        ) : (
          <Link className="nav-link mg" to="/login">
            <b>Login</b>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PublicNavbar;
