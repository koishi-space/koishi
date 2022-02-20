import React, { Component } from "react";
import { getPublicCollections } from "../../../services/api/collectionsService";
import Spinner from "../../../components/common/spinner/spinner";
import "./publicCollectionsOverviewPage.css";
import CollectionCard from "../../../components/collectionCard/collectionCard";

class PublicCollectionsOverviewPage extends Component {
  state = {
    loading: true,
    collections: [],
  };

  componentDidMount() {
    getPublicCollections().then(({ data }) =>
      this.setState({ collections: data, loading: false })
    );
  }

  render() {
    const {collections, loading} = this.state;

    return (
      <div className="view-small-border public-collections-overview">
        <div className="public-collections-overview-div">
          <h1>Public collections</h1>
        </div>
        {loading ? (
            <Spinner />
          ) : (
            <div className="public-collections-overview-grid">
                {collections.map(collection => <CollectionCard collection={collection} showAuthor publicLink />)}
            </div>
          )}
      </div>
    );
  }
}

export default PublicCollectionsOverviewPage;
