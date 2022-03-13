import React from "react";
import "./input.css";

const Input = ({ labelText, error, outlined, noError, ...rest }) => {
  return (
    <div style={{textAlign: "center"}}>
      {labelText && <label htmlFor={rest.name} style={{marginRight: "4px"}}>{labelText}</label>}
      <input {...rest} className="form-input" style={(error) ? {border: "1px solid red"} : {border: outlined ? "1px solid #1138f7" : "none"}} />
      {!noError && <p className="form-input-error">{error}</p>}
    </div>
  );
};

export default Input;
