import React from "react";
import "./input.css";

const Input = ({ labelText, error, ...rest }) => {
  return (
    <div style={{textAlign: "center"}}>
      {labelText && <label htmlFor={rest.name}>{labelText}</label>}
      <input {...rest} className="form-input" style={(error) ? {border: "1px solid red"} : {border: "none"}} />
      <p className="form-input-error">{error}</p>
    </div>
  );
};

export default Input;
