import React, { Component } from "react";
import CreateCollectionForm from "../../../../components/forms/createCollectionForm";
import "./createCollectionPage.css";
import * as collectionsService from "../../../../services/api/collectionsService";

class CreateCollectionPage extends Component {
  async handleFormSubmit(formData) {
    // Send the collection to API
    await collectionsService.createCollection(formData);
  }

  render() {
    return (
      <div className="view main">
        <h1>Create collection</h1>
        <hr />
        <CreateCollectionForm redirectTarget="/app/dashboard" handleSubmit={this. handleFormSubmit} />
      </div>
    );
  }
}

export default CreateCollectionPage;
