import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";
import { clearAuth } from "../api.js";
import { IconLogout } from "./icons.jsx";

export default function Sidebar({ tenantId, tenant, active, onNavigate }) {
  const navigate = useNavigate();
  const initial = tenant?.nome ? tenant.nome.trim().charAt(0).toUpperCase() : "?";

  function sair() {
    clearAuth();
    navigate("/entrar");
  }

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
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="sidebar-footer-name">{tenant?.nome || "Carregando..."}</div>
          <div className="sidebar-footer-role">Prestador</div>
        </div>
        <button className="sidebar-logout" onClick={sair} title="Sair" aria-label="Sair">
          <IconLogout />
        </button>
      </div>
    </>
  );
}
