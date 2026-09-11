import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuth } from "../api.js";
import Sidebar from "./Sidebar.jsx";
import { IconMenu, IconClose } from "./icons.jsx";

export default function Layout({ tenantId, active, children }) {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.access_token || auth.tenant_id !== tenantId) {
      navigate("/entrar", { replace: true });
      return;
    }
    api.getTenant(tenantId).then(setTenant).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <Sidebar tenantId={tenantId} tenant={tenant} active={active} />
      </aside>

      {drawerOpen && (
        <>
          <div
            className="drawer-overlay no-print"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="drawer no-print">
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 12px 0" }}>
              <button
                className="hamburger-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
              >
                <IconClose />
              </button>
            </div>
            <Sidebar
              tenantId={tenantId}
              tenant={tenant}
              active={active}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </>
      )}

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div className="topbar no-print">
          <button
            className="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <IconMenu />
          </button>
          <span className="brand-name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="brand-logo-chip" style={{ width: 26, height: 26 }}>
              <img src="/logo.jpg" alt="iTATech" className="brand-logo" />
            </span>
            iTATech OS
          </span>
        </div>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
