import React from "react";
import "./Logo.css";

const Logo = ({ onClick }) => {
  return (
    <div className="logo" onClick={onClick}>
      My Logo
    </div>
  );
};

export default Logo;
