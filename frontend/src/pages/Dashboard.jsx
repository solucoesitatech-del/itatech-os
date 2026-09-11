import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, STATUS_LABELS } from "../api.js";
import Header from "../components/Header.jsx";

export default function Dashboard() {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([api.getTenant(tenantId), api.listOrders(tenantId)])
      .then(([t, o]) => {
        setTenant(t);
        setOrders(o);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [tenantId]);

  return (
    <div className="app-shell">
      <Header right={tenant?.nome} eyebrow="painel do prestador" />

      <div className="nav-row">
        <Link to={`/painel/${tenantId}/clientes`} className="nav-link">
          Clientes
        </Link>
      </div>

      <h1>Ordens de serviço</h1>
      <p className="subtle">
        {orders.length} {orders.length === 1 ? "ficha aberta" : "fichas abertas"}
      </p>

      {loading && <p className="subtle">Carregando...</p>}
      {erro && <p className="subtle">Não foi possível carregar: {erro}</p>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          Nenhuma ordem de serviço ainda. Toque em "Nova OS" para abrir a primeira ficha.
        </div>
      )}

      {orders.map((o) => (
        <Link key={o.id} to={`/painel/${tenantId}/os/${o.id}`} className="ticket-link">
          <div className="ticket">
            <div className="ticket-row">
              <div>
                <div className="ticket-os">{o.numero_os}</div>
                <div className="ticket-meta">{o.defeito_relatado}</div>
              </div>
              <span className={`status-tag status-${o.status}`}>
                {STATUS_LABELS[o.status]}
              </span>
            </div>
          </div>
        </Link>
      ))}

      <div className="fab-new">
        <Link to={`/painel/${tenantId}/nova`} className="btn">
          + Nova OS
        </Link>
      </div>
    </div>
  );
}
