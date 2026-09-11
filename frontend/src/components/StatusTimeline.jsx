import React from "react";
import { STATUS_LABELS, STATUS_ORDER } from "../api.js";
import { IconCheck } from "./icons.jsx";

export default function StatusTimeline({ status, onSelect, readOnly }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="timeline-h">
      {STATUS_ORDER.map((s, idx) => {
        const done = idx < currentIdx;
        const isCurrent = s === status;
        const classe = `timeline-step${done ? " done" : ""}${isCurrent ? " current" : ""}`;

        return (
          <button
            key={s}
            type="button"
            className={classe}
            disabled={readOnly || isCurrent}
            onClick={() => onSelect && onSelect(s)}
          >
            <span className="timeline-circle">
              {done ? <IconCheck /> : idx + 1}
            </span>
            <span className="timeline-label">{STATUS_LABELS[s]}</span>
          </button>
        );
      })}
    </div>
  );
}
