import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./createRealtimeCollectionCard.css";

const CreateCollectionCard = () => {
  let [redirect, setRedirect] = useState(false);
  return redirect ? (
    <Redirect to="/app/collection/create" />
  ) : (
    <div onClick={() => setRedirect(true)} className="create-graph-card-body">
      <p>+</p>
      <p>Create new</p>
    </div>
  );
};

export default CreateCollectionCard;
