import React from "react";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import "./collectionOptionsPage.css";

// TODO: implement ViewCollectionPage
class CollectionOptionsPage extends React.Component {
  state = {
    collection: "",
  };

  render() {
    return (
      <div className="view collection-edit">
        <WorkspaceNav collectionId={this.props.match.params.id} />
      </div>
    );
  }
}

export default CollectionOptionsPage;
