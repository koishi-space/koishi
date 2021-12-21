import React from "react";
import "./collectionCard.css";

const GraphCard = ({title, inside, onSelect}) => {
    return (
        <div onClick={onSelect} className="graph-card-body">
            <img alt="Graph card image"  />
        </div>
    );
}

export default GraphCard;