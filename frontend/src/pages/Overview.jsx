import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, STATUS_LABELS, STATUS_ORDER } from "../api.js";
import Layout from "../components/Layout.jsx";

export default function Overview() {
  const { tenantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listOrders(tenantId)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [tenantId]);

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <Layout tenantId={tenantId} active="overview">
      <div className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p className="subtle">Resumo das ordens de serviço em aberto e concluídas.</p>
        </div>
      </div>

      {loading && <p className="subtle">Carregando...</p>}

      {!loading && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">Total de ordens</div>
            </div>
            {STATUS_ORDER.map((s) => (
              <div className="stat-card" key={s}>
                <div className="stat-value">{counts[s]}</div>
                <div className="stat-label">{STATUS_LABELS[s]}</div>
              </div>
            ))}
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              Nenhuma ordem de serviço registrada ainda.{" "}
              <Link to={`/painel/${tenantId}/nova`}>Abrir a primeira</Link>.
            </div>
          ) : (
            <p className="subtle">
              Veja a lista completa em{" "}
              <Link to={`/painel/${tenantId}`}>Ordens de Serviço</Link>.
            </p>
          )}
        </>
      )}
    </Layout>
  );
}
