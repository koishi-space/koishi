import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import "./collectionCard.css";

const CollectionCard = ({collection, showAuthor = false, publicLink = false}) => {
    let [redirect, setRedirect] = useState(false);
    let link = (publicLink) ? <Redirect to={`/public-collections/${collection._id}`} /> : <Redirect to={`/app/collection/${collection._id}/view`} />;
    
    return redirect ? (
        link) :
        (<div key={collection._id} onClick={() => setRedirect(true)} className="collection-card-body">
            <div>
                <p>
                    <b>{collection.title}</b>
                {showAuthor && <React.Fragment><br/><i>by {collection.owner}</i></React.Fragment>}
                </p>
            </div>
        </div>
    );
}

export default CollectionCard;