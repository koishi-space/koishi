import React from "react";
import "./button.css";

const Button = ({text, outline, ...rest}) => {
    return (
        <button {...rest} className={outline ? "btn-outline" : "btn"}>{text}</button>
    );
}

export default Button;