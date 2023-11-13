import React from "react";
import icon from "../../Resources/images/Icon.svg";
import "./index.css";

export function LoadingAnimation() {
  return (
    <div className={`loading-animation-image-container pulsating`}>
      <img
        id="iconImage"
        className={`image`}
        src={icon}
        alt="Dalchemist Image"
      />
      <br />
      <p style={{ fontWeight: "bold" }}>Loading...</p>
    </div>
  );
}
