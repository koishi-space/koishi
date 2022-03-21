import React, { Component } from "react";
import Spinner from "../../../../components/common/spinner/spinner";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import { getCollection } from "../../../../services/api/collectionsService";
import "./collectionStatsPage.css";

class CollectionStatsPage extends Component {
  state = {
    loading: true,
    collection: {},
  };

  componentDidMount() {
    getCollection(this.props.match.params.id).then(({ data }) => {
      data.data.value = this.simplifyCollectionStruct(data.data.value);
      this.setState({
        collection: data,
        loading: false,
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

  compAvg = (column) => {
    let sum = 0;
    for (const row of this.state.collection.data.value) {
      sum += parseFloat(row[column]);
    }
    return sum / this.state.collection.data.value.length;
  };

  compMedian = (column) => {
    let dataset = this.state.collection.data.value;

    dataset.sort((a, b) => parseFloat(a[column]) - parseFloat(b[column]));
    if (dataset.length % 2 === 0) {
      let index = dataset.length / 2;
      return (
        (parseFloat(dataset[index - 1][column]) +
          parseFloat(dataset[index][column])) /
        2
      );
    } else {
      return dataset[Math.ceil(dataset.length / 2)][column];
    }
  };

  render() {
    return (
      <div className="view-small-border collection-stats">
        <WorkspaceNav collectionId={this.props.match.params.id} />

        <div className="collection-stats-div">
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div>
              <h1 style={{ marginBottom: "20px" }}>Collection stats</h1>
              {this.state.collection.model.value.map((c) => (
                <>
                  {c.dataType === "number" && (
                    <div className="stats-card">
                      <h2>{c.columnName}</h2>
                      <div>
                        {/* Arithmetic average */}
                        {c.dataType === "number" && (
                          <div>
                            <p data-tip="The sum of a collection of numbers divided by the count of numbers in the collection.">
                              <b>Arithmetic average</b>
                            </p>
                            <p>{this.compAvg(c.columnName)}</p>
                          </div>
                        )}
                        {/* Median */}
                        {c.dataType === "number" && (
                          <div>
                            <p data-tip='The value separating the higher half from the lower half of a data collection. It may be thought of as "the middle" value.'>
                              <b>Median</b>
                            </p>
                            <p>{this.compMedian(c.columnName)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CollectionStatsPage;
