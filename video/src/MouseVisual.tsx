import React from "react";

export const MouseVisual: React.FC<{
  left: boolean;
  middle: boolean;
  right: boolean;
}> = ({ left, middle, right }) => (
  <svg
    width="225"
    height="350"
    viewBox="0 0 180 280"
    fill="none"
    style={{ filter: "drop-shadow(0 20px 22px #0006)" }}
  >
    <defs>
      <linearGradient
        id="mouse-shell"
        x1="15"
        y1="15"
        x2="165"
        y2="255"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#555b64" />
        <stop offset=".5" stopColor="#2b2f35" />
        <stop offset="1" stopColor="#14161b" />
      </linearGradient>
      <linearGradient
        id="mouse-button"
        x1="20"
        y1="10"
        x2="140"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4b5058" />
        <stop offset="1" stopColor="#292d33" />
      </linearGradient>
      <linearGradient
        id="mouse-lit"
        x1="25"
        y1="12"
        x2="150"
        y2="135"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#b9f5ff" />
        <stop offset="1" stopColor="#4cafff" />
      </linearGradient>
    </defs>
    <path
      d="M12 102C12 35 38 8 90 8S168 35 168 102V190C168 247 142 271 90 271S12 247 12 190Z"
      fill="#0c0e12"
      stroke="#5b626d"
      strokeWidth="2"
    />
    <path
      d="M12 96C12 29 38 2 90 2S168 29 168 96V184C168 241 142 265 90 265S12 241 12 184Z"
      fill="url(#mouse-shell)"
      stroke="#929aa5"
      strokeWidth="1.4"
    />
    <path
      d="M18 99C18 37 40 10 85 9V124H18Z"
      fill={left ? "url(#mouse-lit)" : "url(#mouse-button)"}
      stroke={left ? "#b9f4ff" : "#69717c"}
      strokeWidth="1.2"
      transform={`translate(0 ${left ? 2 : 0})`}
    />
    <path
      d="M95 9C140 10 162 37 162 99V124H95Z"
      fill={right ? "url(#mouse-lit)" : "url(#mouse-button)"}
      stroke={right ? "#b9f4ff" : "#69717c"}
      strokeWidth="1.2"
      transform={`translate(0 ${right ? 2 : 0})`}
    />
    <rect
      x="80"
      y="44"
      width="20"
      height="47"
      rx="10"
      fill={middle ? "url(#mouse-lit)" : "#15181d"}
      stroke={middle ? "#d0f8ff" : "#959da7"}
      strokeWidth="2"
    />
    {[54, 62, 70, 78].map((y) => (
      <path
        key={y}
        d={`M85 ${y}H95`}
        stroke={middle ? "#29618d" : "#747d89"}
        strokeWidth="1.3"
      />
    ))}
    <path d="M27 148C27 211 45 246 90 248" stroke="#7aa1c626" strokeWidth="2" />
    <path
      d="M73 199L103 222L90 224L97 239L88 243L81 227L72 235Z"
      fill="#6b9ec04d"
    />
  </svg>
);
