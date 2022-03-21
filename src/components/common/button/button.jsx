import React from "react";
import "./button.css";

const Button = ({ text, outline, kind, classes: propClasses, ...rest }) => {
  let classes = [];
  if (outline) classes.push("btn-outline");
  else classes.push("btn")
  if (propClasses) classes.push(propClasses);

  return (
    <button {...rest} className={classes.join(" ")}>
      {text}
    </button>
  );
};

export default Button;
