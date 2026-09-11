import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { IconChevronRight } from "../components/icons.jsx";

export default function Dashboard() {
  const { tenantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api
      .listOrders(tenantId)
      .then(setOrders)
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [tenantId]);

  return (
    <Layout tenantId={tenantId} active="orders">
      <div className="page-header">
        <div>
          <h1>Ordens de serviço</h1>
          <p className="subtle">
            {orders.length} {orders.length === 1 ? "ficha aberta" : "fichas abertas"}
          </p>
        </div>
        <Link to={`/painel/${tenantId}/nova`} className="btn">
          + Nova OS
        </Link>
      </div>

      {loading && <p className="subtle">Carregando...</p>}
      {erro && <p className="subtle">Não foi possível carregar: {erro}</p>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          Nenhuma ordem de serviço ainda. Toque em "+ Nova OS" para abrir a
          primeira ficha.
        </div>
      )}

      {orders.length > 0 && (
        <div className="card">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/painel/${tenantId}/os/${o.id}`}
              className="card-list-item"
            >
              <div>
                <div className="card-list-os">{o.numero_os}</div>
                <div className="card-list-meta">{o.defeito_relatado}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge status={o.status} />
                <IconChevronRight className="card-list-chevron" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
