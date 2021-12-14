import React from "react";
import "./button.css";

const Button = ({text, ...rest}) => {
    return (
        <button {...rest} className="btn">{text}</button>
    );
}

export default Button;