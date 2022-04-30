import React from "react";
import { NavLink, Redirect } from "react-router-dom";
import "./workspaceNav.css";

const WorkspaceNav = ({ collectionId }) => {

  return collectionId ? (
    <div style={{marginTop: "50px", marginBottom: "50px"}}>
      <NavLink
        to={`/app/collection/${collectionId}/view`}
        style={{ margin: "10px 20px" }}
        className={(a) =>
          a ? "workspace-nav-btn" : "workspace-nav-btn-outline"
        }
      >
        View
      </NavLink>
      <NavLink
        to={`/app/collection/${collectionId}/stats`}
        style={{ margin: "10px 20px" }}
        className={(a) =>
          a ? "workspace-nav-btn" : "workspace-nav-btn-outline"
        }
      >
        Stats
      </NavLink>
      <NavLink
        to={`/app/collection/${collectionId}/edit`}
        style={{ margin: "10px 20px" }}
        className={(a) =>
          a ? "workspace-nav-btn" : "workspace-nav-btn-outline"
        }
      >
        Edit
      </NavLink>
      <NavLink
        to={`/app/collection/${collectionId}/actions`}
        style={{ margin: "10px 20px" }}
        className={(a) =>
          a ? "workspace-nav-btn" : "workspace-nav-btn-outline"
        }
      >
        Actions
      </NavLink>
      <NavLink
        style={{ margin: "10px 20px" }}
        to={`/app/collection/${collectionId}/options`}
        className={(a) =>
          a ? "workspace-nav-btn" : "workspace-nav-btn-outline"
        }
      >
        Options
      </NavLink>
    </div>
  ) : <Redirect to="/app/dashboard" />;
};

export default WorkspaceNav;
