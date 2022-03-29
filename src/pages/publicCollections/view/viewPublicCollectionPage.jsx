import React, { Component } from "react";
import Spinner from "../../../components/common/spinner/spinner";
import { getPublicCollection } from "../../../services/api/collectionsService";
import "./viewPublicCollectionPage.css";
import Select from "../../../components/common/select/select";
import ComposedGraphComponent from "../../../components/graphs/composedGraphComponent";
import RadarGraphComponent from "../../../components/graphs/radarGraphComponent";
import PieGraphComponent from "../../../components/graphs/pieGraphComponent";

class ViewPublicCollectionPage extends Component {
  state = {
    loading: true,
    collection: {},
    selectedSettingsPreset: "",
    graphVariant: "composed",
    graphVariants: [
      { key: "composed", value: "Composed graph" },
      { key: "radar", value: "Radar chart" },
      { key: "pie", value: "Pie chart" },
    ],
  };

  componentDidMount() {
    getPublicCollection(this.props.match.params.id).then(
      ({ data: collection }) => {
        collection.data.value = this.simplifyCollectionStruct(
          collection.data.value
        );
        this.setState({
          collection,
          loading: false,
          selectedSettingsPreset: collection.settings[0]._id,
        });
      }
    );
  }

  simplifyCollectionStruct = (payload) => {
    let simplified = [];
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

  render() {
    const { loading, collection } = this.state;
    return (
      <div className="view-small-border public-collection-view">
        {loading ? (
          <Spinner />
        ) : (
          <div className="public-collection-view-div">
            <h1>{collection.title}</h1>
            <h4>
              <i>by {collection.owner}</i>
            </h4>
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
                <p>
                  There are no collection presets. Contact the author to create
                  one.
                </p>
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
            </div>

            {/* Select graph type */}
            {this.state.selectedSettingsPreset.length > 0 && (
              <div className="graph-selection mb20">
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
              </div>
            )}

            {/* Graph Section */}
            {this.state.selectedSettingsPreset.length > 0 && (
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
                {/* Radar Graph */}
                {this.state.graphVariant === "radar" && (
                  <RadarGraphComponent
                    settingsPreset={
                      this.state.collection.settings.find(
                        (x) => x._id === this.state.selectedSettingsPreset
                      ).radarGraph
                    }
                    collectionData={this.state.collection.data.value}
                  />
                )}
                {/* Pie Chart */}
                {this.state.graphVariant === "pie" && (
                  <PieGraphComponent
                    settingsPreset={
                      this.state.collection.settings.find(
                        (x) => x._id === this.state.selectedSettingsPreset
                      ).pieGraph
                    }
                    collectionData={this.state.collection.data.value}
                    collectionModel={this.state.collection.model.value}
                  />
                )}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ViewPublicCollectionPage;
