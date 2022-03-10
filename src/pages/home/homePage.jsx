import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import Button from "../../components/common/button/button";
import "./homePage.css";
import auth from "../../services/authService";

const HomePage = () => {
  return (
    <>
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
            />
            <br className="homepage-linebreak" />
            your data.
          </h1>
          <p>
            The easiest data tool out there. Scalable to the moon. Unleash the
            potential of your data with Koishi.
          </p>
          {auth.getCurrentUser() ? (
            <Link to="/app/dashboard" style={{ width: "max-content" }}>
              <Button text="App" />
            </Link>
          ) : (
            <Link to="/login" style={{ width: "max-content" }}>
              <Button text="Get started" />
            </Link>
          )}
        </div>
        <div className="spot-right">
          <img
            className="spot-image"
            src={window.location.origin + "/assets/graph_large.png"}
            alt="Large graph"
          />
        </div>
      </div>
      <div className="homepage-cards-header">
        <p>Why use Koishi?</p>
      </div>
      <div className="homepage-cards">
        <div className="homepage-card">
          <p className="homepage-card-heading">Free and opensource</p>
          <p className="homepage-card-text">
            Use it however you want, edit the source code, engage in
            development.
          </p>
          <div className="homepage-card-buttons">
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/hendrychjan/koishi"
            >
              Github repository
            </a>
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              Donate on Patreon
            </a>
          </div>
        </div>
        <div className="homepage-card">
          <p className="homepage-card-heading">Easy to use</p>
          <p className="homepage-card-text">
            No need to study manuals. Everyone can make use of it, no matter
            their technical skills.
          </p>
          <div className="homepage-card-buttons">
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              Get started
            </a>
          </div>
        </div>
        <div className="homepage-card">
          <p className="homepage-card-heading">Flexible</p>
          <p className="homepage-card-text">
            Universal by design. Start with the web app or Koishi mobile or
            utilize the REST API to automate the data collection process.
          </p>
          <div className="homepage-card-buttons">
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              App
            </a>
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              Get started with API
            </a>
            <a
              className="nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              Koishi for Android
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
