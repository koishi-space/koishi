import React from "react";
import "./checkbox.css";

const Checkbox = ({ labelText, error, outlined, noError, value, ...rest }) => {
  return (
    <div style={{textAlign: "center"}}>
      {labelText && <label htmlFor={rest.name}>{labelText}</label>}
      <input {...rest} type="checkbox" checked={value.toString() === "true"} className="form-input" style={(error) ? {border: "1px solid red"} : {border: outlined ? "1px solid #1138f7" : "none"}} />
      {!noError && <p className="form-input-error">{error}</p>}
    </div>
  );
};

export default Checkbox;
