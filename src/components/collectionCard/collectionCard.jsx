import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import "./collectionCard.css";

const CollectionCard = ({collection}) => {
    let [redirect, setRedirect] = useState(false);
    return redirect ? (
        <Redirect to={`/app/collection/${collection._id}/view`} />) :
        (<div onClick={() => setRedirect(true)} className="collection-card-body">
            <div>
                <p>{collection.title}</p>
            </div>
        </div>
    );
}

export default CollectionCard;