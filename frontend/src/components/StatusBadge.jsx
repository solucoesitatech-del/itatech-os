import React from "react";
import { STATUS_LABELS } from "../api.js";

export default function StatusBadge({ status, large }) {
  return (
    <span className={`status-badge status-${status}${large ? " status-badge-lg" : ""}`}>
      <span className="dot" />
      {STATUS_LABELS[status]}
    </span>
  );
}
