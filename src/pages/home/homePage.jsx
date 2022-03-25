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
            <Link to="/app/dashboard" style={{ width: "max-content", textDecoration: "none" }}>
              <Button text="App" />
            </Link>
          ) : (
            <Link to="/login" style={{ width: "max-content", textDecoration: "none" }}>
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
              className="homepage-card-nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/hendrychjan/koishi"
            >
              Github repository
            </a>
            <a
              className="homepage-card-nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://www.patreon.com/janhendrych"
            >
              Become a Patron
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
              className="homepage-card-nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://hendrychjan.notion.site/Tutorials-23d49ec926a1457284ee701c11053f91"
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
            <Link to="/app/dashboard"
            >
              App
            </Link>
            <a
              className="homepage-card-nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://hendrychjan.notion.site/API-Documentation-28b14a233fab4a7e92b697c8e1859338"
            >
              Get started with API
            </a>
            <a
              className="homepage-card-homepage-card-nav-link mg"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/hendrychjan/koishi-mobile#installation"
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
