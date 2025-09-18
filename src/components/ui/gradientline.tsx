import React from "react";

const GradientLine: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={ "100%"} // make it responsive
      height="20"          // give enough vertical space
      viewBox="0 0 343 10" // match height
    >
      {/* dotted line */}
      <line
        x1="0"
        y1="10"              // middle of the svg
        x2="743"
        y2="10.0001"
        stroke="url(#gradient)"
        strokeWidth="1"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />

      {/* gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF466F" />
          <stop offset="22%" stopColor="#FF315E" />
          <stop offset="49%" stopColor="#E861FF" />
          <stop offset="75%" stopColor="#4771FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientLine;