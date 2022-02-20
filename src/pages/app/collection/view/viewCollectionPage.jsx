import React from "react";
import "./viewCollectionPage.css";
import {
  getCollection,
  saveCollectionSettings,
  newCollectionSettings,
} from "../../../../services/api/collectionsService";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import SettingsIcon from "@mui/icons-material/Settings";
import Select from "../../../../components/common/select/select";
import ComposedGraphSettingsForm from "../../../../components/forms/composedGraphSettingsForm";
import Spinner from "../../../../components/common/spinner/spinner";
import Button from "../../../../components/common/button/button";
import { toast } from "react-toastify";
import ComposedGraphComponent from "../../../../components/graphs/composedGraphComponent";

class ViewCollectionPage extends React.Component {
  state = {
    loading: true,
    collection: "",
    settingsOpened: false,
    graphVariant: "composed",
    selectedSettingsPreset: "",
    graphVariants: [
      { key: "", value: "Select chart variant" },
      { key: "composed", value: "Composed graph" },
    ],
  };

  componentDidMount() {
    getCollection(this.props.match.params.id).then(({ data }) => {
      data.data.value = this.simplifyCollectionStruct(data.data.value);
      this.setState({
        collection: data,
        loading: false,
        selectedSettingsPreset: data.settings[0]._id,
      });
    });
  }

  simplifyCollectionStruct = (payload) => {
    let simplified = new Array();
    let newItem = {};
    for (let x of payload) {
      for (let y of x) {
        newItem[y.column] = y.data;
      }
      simplified.push(newItem);
      newItem = {};
    }
    return simplified;
  };

  handleOpenSettings = () => {
    this.setState({ settingsOpened: true });
  };

  handleCloseSettings = () => {
    this.setState({ settingsOpened: false });
  };

  handleCreateNewSettings = () => {
    newCollectionSettings(this.state.collection._id).then(({ data }) => {
      let collection = this.state.collection;
      collection.settings.push(data);
      this.setState({ collection, selectedSettingsPreset: data._id });
      toast.info("Created new settings preset");
    });
  };

  handleSaveSettings = (newSettings) => {
    const { selectedSettingsPreset } = this.state;
    let collection = this.state.collection;
    for (let s of collection.settings)
      if (s._id === selectedSettingsPreset) {
        s.composedGraph = newSettings;
        break;
      }

    this.setState({ collection });
    this.handleCloseSettings();
    saveCollectionSettings(
      collection._id,
      selectedSettingsPreset,
      collection.settings.find((s) => s._id === selectedSettingsPreset)
    ).then(() => toast.info("Settings modified"));
  };

  render() {
    let settings;
    if (!this.state.loading && this.state.selectedSettingsPreset !== "")
      settings = this.state.collection.settings.find(
        (p) => p._id === this.state.selectedSettingsPreset
      );
    return (
      <div className="view-small-border collection-view">
        {/* Workspace navigation */}
        <WorkspaceNav collectionId={this.props.match.params.id} />

        <div className="collection-view-div">
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div>
              {/* Select settings preset */}
              <div
                className="mb10"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                {this.state.collection.settings.length === 0 ? (
                  <p>There are no collection presets. Create one!</p>
                ) : (
                  <Select
                    options={this.state.collection.settings.map((p) => {
                      return { value: p._id, text: p.name };
                    })}
                    textKey="text"
                    valueKey="value"
                    outline
                    noError
                    value={this.state.selectedSettingsPreset}
                    onChange={(e) =>
                      this.setState({ selectedSettingsPreset: e.target.value })
                    }
                  />
                )}
                <Button
                  text="+"
                  classes={["ml10"]}
                  onClick={this.handleCreateNewSettings}
                />
              </div>

              {/* Select graph type */}
              {this.state.selectedSettingsPreset.length > 0 && (
                <div className="graph-selection">
                  <Select
                    options={this.state.graphVariants}
                    textKey="value"
                    valueKey="key"
                    outline
                    noError
                    value={this.state.graphVariant}
                    onChange={(e) =>
                      this.setState({ graphVariant: e.target.value })
                    }
                  />
                  <SettingsIcon onClick={this.handleOpenSettings} />
                </div>
              )}

              {/* Graph section */}
              {!this.state.settingsOpened &&
                this.state.selectedSettingsPreset.length > 0 && (
                  <React.Fragment>
                    {/* Bar Graph */}
                    {this.state.graphVariant === "composed" && (
                      <ComposedGraphComponent
                        settingsPreset={
                          this.state.collection.settings.find(
                            (x) => x._id === this.state.selectedSettingsPreset
                          ).composedGraph
                        }
                        collectionData={this.state.collection.data.value}
                      />
                    )}
                  </React.Fragment>
                )}

              {/* Graph settings section */}
              {this.state.settingsOpened && (
                <React.Fragment>
                  {this.state.graphVariant === "composed" && (
                    // Bar graph settings
                    <React.Fragment>
                      <h1>Graph settings</h1>
                      <ComposedGraphSettingsForm
                        initialCollectionSettings={
                          this.state.collection.settings.find(
                            (s) => s._id === this.state.selectedSettingsPreset
                          ).composedGraph
                        }
                        collectionModel={this.state.collection.model}
                        handleSaveSettings={this.handleSaveSettings}
                        handleCloseSettings={this.handleCloseSettings}
                      />
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ViewCollectionPage;
