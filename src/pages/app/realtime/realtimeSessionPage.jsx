import React, { Component } from "react";
import { io } from "socket.io-client";
import "../collection/view/viewCollectionPage.css";
import {
  getEmptySettings,
  saveRealtimeSession,
} from "../../../services/api/toolsService";
import Spinner from "../../../components/common/spinner/spinner";
import ComposedGraphSettingsForm from "../../../components/forms/composedGraphSettingsForm";
import ComposedGraphComponent from "../../../components/graphs/composedGraphComponent";
import Button from "../../../components/common/button/button";
import { Redirect } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

class RealtimeSessionPage extends Component {
  state = {
    collectionId: "",
    redirect: false,
    title: "",
    model: {},
    data: [],
    graphSettings: [],
    socket: null,
    loading: true,
    status: "Not connected",
    settingsOpened: false,
  };

  async componentDidMount(props) {
    let { data: settings } = await getEmptySettings();

    const socket = io(process.env.REACT_APP_API_URL);
    let collectionModel = {
      value: this.props.location.state.collectionModel.model,
    };

    socket.on("connect", () => {
      this.setState({
        status: "Connected as " + socket.id,
        model: collectionModel,
        graphSettings: settings,
        loading: false,
        title: this.props.location.state.collectionModel.title,
      });

      socket.on("realtime session", ({ content, from }) => {
        this.setState({ data: [...this.state.data, content] });
      });
    });

    this.setState({ socket });
  }

  componentWillUnmount() {
      console.log("Disconnecting from socket.io");
      this.state.socket.emit("end");
  }

  handleSaveSettings = (newSettings, chartType) => {
    let update = this.state.graphSettings;
    update.composedGraph = newSettings;
    this.setState({ graphSettings: update });
    this.handleCloseSettings();
    // currentSettings.composedGraph = newSettings;
  };

  handleSaveSession = async () => {
    this.setState({ loading: true });
    const { data } = await saveRealtimeSession(
      this.state.title,
      this.state.data,
      this.state.model.value,
      this.state.graphSettings
    );
    this.setState({ collectionId: data._id, redirect: true });
  };

  handleOpenSettings = () => {
    this.setState({ settingsOpened: true });
  };

  handleCloseSettings = () => {
    this.setState({ settingsOpened: false });
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to={`/app/collection/${this.state.collectionId}/view`} />
      );
    } else {
      return (
        <div
          style={{ marginTop: "40px" }}
          className="view-small-border collection-view"
        >
          <div className="collection-view-div">
            {this.state.loading ? (
              <Spinner />
            ) : (
              <div>
                <h1>Session {this.state.title}</h1>
                <CopyToClipboard
                  text={this.state.status.split(" ")[2]}
                  onCopy={() =>
                    toast.info("Session ID copied to clipboard!")
                  }
                >
                  <p style={{ color: "#07bc0c" }}>{this.state.status}</p>
                </CopyToClipboard>
                <div
                  style={{
                    margin: "20px 0",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    classes={["mr10"]}
                    outline
                    text={"Settings"}
                    onClick={this.handleOpenSettings}
                  />
                  {this.state.data.length > 0 && (
                    <Button
                      classes={["ml0"]}
                      text={"Save the session"}
                      onClick={this.handleSaveSession}
                    />
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!this.state.settingsOpened && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ComposedGraphComponent
                        settingsPreset={this.state.graphSettings.composedGraph}
                        collectionData={this.state.data}
                      />
                    </div>
                  )}
                  {this.state.settingsOpened && (
                    <>
                      <h1>Graph settings</h1>
                      <ComposedGraphSettingsForm
                        initialCollectionSettings={
                          this.state.graphSettings.composedGraph
                        }
                        collectionModel={this.state.model}
                        handleSaveSettings={this.handleSaveSettings}
                        handleCloseSettings={this.handleCloseSettings}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default RealtimeSessionPage;
