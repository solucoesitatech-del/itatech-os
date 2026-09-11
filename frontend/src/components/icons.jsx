import React from "react";

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconOverview(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconOrders(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v3h6V3" />
      <path d="M8 11h8M8 15h8" />
    </svg>
  );
}

export function IconClients(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.2" cy="8.6" r="2.4" />
      <path d="M15.5 14.4c2.7.3 5 2.4 5 5.6" />
    </svg>
  );
}

export function IconFinance(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.3c0-1.1 1.1-1.8 2.5-1.8 1.6 0 2.6.8 2.6 1.9 0 2.6-5.1 1.2-5.1 3.8 0 1.1 1.1 1.9 2.6 1.9 1.4 0 2.5-.7 2.5-1.8" />
    </svg>
  );
}

export function IconStock(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
    </svg>
  );
}

export function IconReports(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

export function IconSettings(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

export function IconStack(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5M3 8v0" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.4-3.4" />
    </svg>
  );
}

export function IconPackage(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <path d="M21 8.5 12 4 3 8.5 12 13l9-4.5Z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5M12 13v7.5" />
    </svg>
  );
}

export function IconThumbUp(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <path d="M7 11v9H4v-9h3Zm0 0 3.5-7a2 2 0 0 1 2 2.2L11.8 9H18a2 2 0 0 1 1.9 2.7l-2 6A2 2 0 0 1 16 19H7" />
    </svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function IconClipboard(props) {
  return (
    <svg {...base} className="icon" {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconChevronRight(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconWhatsapp(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
      <path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.1L2.5 21.5l5.1-1.3A9.4 9.4 0 1 0 12 2.5Zm0 1.7a7.7 7.7 0 0 1 6.5 11.8l-.2.4.9 3.3-3.4-.9-.4.2A7.7 7.7 0 1 1 12 4.2Zm-3.4 3.9c-.2 0-.5 0-.7.3-.2.3-.9.8-.9 2s.9 2.3 1 2.5c.1.1 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4-.3-.2-1.5-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1s-.3.2-.6 0c-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.8-.1-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5Z" />
    </svg>
  );
}

export function IconCopy(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V5a1 1 0 0 1 1-1h11" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}
