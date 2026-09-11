import React from "react";

function TagMark() {
  return (
    <svg
      className="brand-mark"
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 5 Q16 0 21 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 6 H24 V19 L16 28 L8 19 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="16" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Header({ right, eyebrow }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <TagMark />
        <div>
          <span className="brand">iTATech OS</span>
          {eyebrow && <div className="brand-eyebrow">{eyebrow}</div>}
        </div>
      </div>
      {right && <div className="header-right">{right}</div>}
    </header>
  );
}
