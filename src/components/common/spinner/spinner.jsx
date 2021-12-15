import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Spinner = () => {
  return (
    <Loader
      type="TailSpin"
      color="#1138f7"
      height={50}
      width={50}
    />
  );
};

export default Spinner;
