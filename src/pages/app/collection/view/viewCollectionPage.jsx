import React from "react";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import "./viewCollectionPage.css";

// TODO: implement ViewCollectionPage
class ViewCollectionPage extends React.Component {
  state = {
    collection: "",
  };

  render() {
    return (
      <div className="view collection-view">
        <WorkspaceNav collectionId={this.props.match.params.id} />
        <div className="collection-view-div">
          
        </div>
      </div>
    );
  }
}

export default ViewCollectionPage;
