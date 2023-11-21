import React from "react";

interface Props {
  name: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function Button({
  name,
  icon,
  active,
  onClick,
  style = {},
  className = "",
}: Props) {
  return (
    <span
      className={`navButton ${active && "activeButton"} ${className}`}
      style={style}
      onClick={() => {
        onClick();
      }}
    >
      <img src={icon} alt={`${active} Icon Image`} /> {name}
    </span>
  );
}
