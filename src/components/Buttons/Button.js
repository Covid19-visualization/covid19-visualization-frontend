import React, { useState } from "react";
import "./Button.css";
import { Link } from "react-router-dom";

const STYLES = ["btn--primary", "btn--outline"];
const SIZES = ["btn--medium", "btn--large"];

export const Button = ({
  children,
  type,
  onClick,
  style
}) => {

  const [hover, setHover] = useState(false)

  return (
    <button
      className="btn"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      type={type}
      style={{
        backgroundColor: !hover? "white" : "#e6e6e6",
        transition:" all 0.3 ease-out"
      }}
    >
      {children}
    </button>
  );
};
