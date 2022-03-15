import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./createCollectionCard.css";

const CreateRealtimeCollectionCard = () => {
  let [redirect, setRedirect] = useState(false);
  return redirect ? (
    <Redirect to="/app/realtime/create" />
  ) : (
    <div onClick={() => setRedirect(true)} className="create-rt-graph-card-body">
      <p>{"<>"}</p>
      <p>New realtime</p>
    </div>
  );
};

export default CreateRealtimeCollectionCard;
