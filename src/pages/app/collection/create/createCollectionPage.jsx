import React, { Component } from "react";
import CreateCollectionForm from "../../../../components/forms/createCollectionForm";
import "./createCollectionPage.css";

class CreateCollectionPage extends Component {
  render() {
    return (
      <div className="view main">
        <h1>Create collection</h1>
        <hr />
        <CreateCollectionForm />
      </div>
    );
  }
}

export default CreateCollectionPage;
