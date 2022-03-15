import React, { Component } from "react";
import CreateCollectionForm from "../../../components/forms/createCollectionForm";

class NewRealtimeSessionPage extends Component {
  state = {
    collectionModel: {},
  };

  render() {
    return (
      <div className="view main">
        <h1>Initialize realtime session</h1>
        <hr />
        <CreateCollectionForm
          redirectTarget={{
            pathname: "/app/realtime/session",
            state: { collectionModel: this.state.collectionModel },
          }}
          handleSubmit={async (formData) => {
            this.setState({ collectionModel: formData });
          }}
        />
      </div>
    );
  }
}

export default NewRealtimeSessionPage;
