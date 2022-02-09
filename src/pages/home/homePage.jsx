import React from "react";
import {Link} from "react-router-dom";
import {Typewriter} from "react-simple-typewriter";
import Button from "../../components/common/button/button";
import "./home.css";
import auth from "../../services/authService";

const HomePage = () => {
  return (
    <div className="spot">
      <div className="spot-left">
          <h1>
            <Typewriter
            loop
            cursor
            cursorStyle="_   "
            typeSpeed={100}
            deleteSpeed={80}
            delaySpeed={2500}
            words={["Collect", "Organize", "Visualize", "Understand"]}
          />your data.</h1>
          {/* <h1>Collect your data</h1> */}
          <p>The easiest data tool out there. Scalable to the moon. Unleash the potential of your data with Koishi.</p>
          {auth.getCurrentUser() ? 
          <Link to="/app/dashboard" style={{width: "max-content"}}><Button text="App"/></Link>
          :
          <Link to="/login" style={{width: "max-content"}}><Button text="Get started"/></Link>
          }
      </div>
      <div className="spot-right">
          <img className="spot-image" src={window.location.origin + "/assets/graph_large.png"} alt="Large image of a graph" />
      </div>
    </div>
  );
};

export default HomePage;
