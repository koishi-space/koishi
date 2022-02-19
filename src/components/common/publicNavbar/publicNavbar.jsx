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
        {/* <NavLink className={a => a ? "nav-link-active mg" : "nav-link mg"} to="/about">
          About
        </NavLink> */}
        {auth.getCurrentUser() ? (
          <NavLink
            className={(a) => (a ? "nav-link-active mg" : "nav-link mg")}
            to="/app/dashboard"
          >
            App
          </NavLink>
        ) : (
          <Link className="nav-link mg" to="/login">
            Get started
          </Link>
        )}
        <a
          className="nav-link mg"
          target="_blank"
          rel="noreferrer"
          href="https://hendrychjan.notion.site/Koishi-docs-706dfe04d2d34861a8316af7bd26ceb9"
        >
          Documentation
        </a>
        <a
          className="nav-link mg"
          target="_blank"
          rel="noreferrer"
          href="https://hendrychjan.notion.site/API-Documentation-28b14a233fab4a7e92b697c8e1859338"
        >
          API
        </a>
        {user ? (
          <div className="dropdown mg">
            <a className="nav-link">
              <b>
                <u>{user.name}</u>
              </b>
            </a>
            <div className="dropdown-content">
              <NavLink
                className={(a) => (a ? "nav-link-active" : "nav-link")}
                to="/profile"
              >
                Profile
              </NavLink>
              <NavLink className="nav-link" to="/logout">
                <u>Log out</u>
              </NavLink>
            </div>
          </div>
        ) : (
          <NavLink
            className={(a) => (a ? "nav-link-active mg" : "nav-link mg")}
            to="/login"
          >
            <b>Login</b>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default PublicNavbar;
