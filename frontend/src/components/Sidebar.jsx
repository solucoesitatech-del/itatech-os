import React from "react";
import { Link } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";

function TagMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5 Q16 0 21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6 H24 V19 L16 28 L8 19 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Sidebar({ tenantId, tenant, active, onNavigate }) {
  const initial = tenant?.nome ? tenant.nome.trim().charAt(0).toUpperCase() : "?";

  return (
    <>
      <div className="sidebar-brand">
        <span style={{ color: "var(--accent)" }}>
          <TagMark />
        </span>
        <span className="brand-name">iTATech OS</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path(tenantId)}
              className={`sidebar-link${active === item.key ? " active" : ""}${item.soon ? " soon" : ""}`}
              onClick={onNavigate}
            >
              <Icon />
              <span>{item.label}</span>
              {item.soon && <span className="soon-tag">em breve</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">{initial}</div>
        <div style={{ minWidth: 0 }}>
          <div className="sidebar-footer-name">{tenant?.nome || "Carregando..."}</div>
          <div className="sidebar-footer-role">Prestador</div>
        </div>
      </div>
    </>
  );
}
