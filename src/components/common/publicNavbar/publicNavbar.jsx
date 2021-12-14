import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./publicNavbar.css";

const PublicNavbar = (props) => {
  return (
    <div className="navbar">
      <Link className="no-decor" to="/"><h1>Koishi</h1></Link>
      <div>
        <NavLink className="nav-link" to="/about">
          About
        </NavLink>
        <NavLink className="nav-link" to="/get-started">
          Get started
        </NavLink>
        <NavLink className="nav-link" to="/api">
          API
        </NavLink>
        <NavLink className="nav-link" to="/docs">
          Docs
        </NavLink>
        <Link className="nav-link" to="/login">
          <b>Login</b>
        </Link>
      </div>
    </div>
  );
};

export default PublicNavbar;
