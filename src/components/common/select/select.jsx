import React from "react";
import "./select.css";

const Select = ({
  options,
  textKey,
  valueKey,
  labelText,
  placeholder,
  error,
  outline,
  noError,
  ...rest
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      {labelText && <label htmlFor={rest.name}>{labelText}</label>}
      <select
        {...rest}
        className="form-select"
        style={
          error
            ? { border: "1px solid red" }
            : { border: outline ? "1px solid #1138f7" : "none" }
        }
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o[valueKey]} value={o[valueKey]}>
            {o[textKey]}
          </option>
        ))}
      </select>
      {!noError && <p className="form-select-error">{error}</p>}
    </div>
  );
};

export default Select;
