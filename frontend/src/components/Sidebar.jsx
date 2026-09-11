import React from "react";
import { Link } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";

export default function Sidebar({ tenantId, tenant, active, onNavigate }) {
  const initial = tenant?.nome ? tenant.nome.trim().charAt(0).toUpperCase() : "?";

  return (
    <>
      <div className="sidebar-brand">
        <span className="brand-logo-chip">
          <img src="/logo.jpg" alt="iTATech" className="brand-logo" />
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
