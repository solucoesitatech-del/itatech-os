import React from "react";
import { STATUS_LABELS, STATUS_ORDER } from "../api.js";
import { IconCheck } from "./icons.jsx";

const STATUS_COLOR_VAR = {
  recebido: "var(--status-recebido)",
  em_analise: "var(--status-em_analise)",
  aguardando_peca: "var(--status-aguardando_peca)",
  pronto: "var(--status-pronto)",
  entregue: "var(--status-entregue)",
};

const STATUS_TINT = {
  recebido: "#eef1f5",
  em_analise: "#e6edfd",
  aguardando_peca: "#fdf0dc",
  pronto: "#e4f6e9",
  entregue: "#dcf0e3",
};

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
            style={{ "--step-color": STATUS_COLOR_VAR[s], "--step-tint": STATUS_TINT[s] }}
            disabled={readOnly || isCurrent}
            onClick={() => onSelect && onSelect(s)}
          >
            <span className="timeline-circle">
              {done || isCurrent ? <IconCheck /> : idx + 1}
            </span>
            <span className="timeline-label">{STATUS_LABELS[s]}</span>
          </button>
        );
      })}
    </div>
  );
}
