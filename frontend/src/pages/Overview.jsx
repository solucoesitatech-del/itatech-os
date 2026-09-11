import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, STATUS_LABELS, STATUS_ORDER } from "../api.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import {
  IconClipboard,
  IconClock,
  IconSearch,
  IconPackage,
  IconThumbUp,
  IconCheckCircle,
  IconChevronRight,
} from "../components/icons.jsx";

const STATUS_ICON = {
  recebido: IconClock,
  em_analise: IconSearch,
  aguardando_peca: IconPackage,
  pronto: IconThumbUp,
  entregue: IconCheckCircle,
};

const STATUS_TINT = {
  recebido: "#eef1f5",
  em_analise: "#e6edfd",
  aguardando_peca: "#fdf0dc",
  pronto: "#e4f6e9",
  entregue: "#dcf0e3",
};

const STATUS_COLOR_VAR = {
  recebido: "var(--status-recebido)",
  em_analise: "var(--status-em_analise)",
  aguardando_peca: "var(--status-aguardando_peca)",
  pronto: "var(--status-pronto)",
  entregue: "var(--status-entregue)",
};

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

  const recentes = [...orders]
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
    .slice(0, 5);

  return (
    <Layout tenantId={tenantId} active="overview">
      <div className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p className="subtle">Resumo das ordens de serviço em aberto e concluídas.</p>
        </div>
        <Link to={`/painel/${tenantId}/nova`} className="btn">
          + Nova Ordem de Serviço
        </Link>
      </div>

      {loading && <p className="subtle">Carregando...</p>}

      {!loading && (
        <>
          <div className="stat-grid">
            <div className="stat-card stat-card-total">
              <div className="stat-card-icon">
                <IconClipboard />
              </div>
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">Total de OS</div>
            </div>
            {STATUS_ORDER.map((s) => {
              const Icon = STATUS_ICON[s];
              return (
                <div className="stat-card" key={s}>
                  <div
                    className="stat-card-icon"
                    style={{ background: STATUS_TINT[s], color: STATUS_COLOR_VAR[s] }}
                  >
                    <Icon />
                  </div>
                  <div className="stat-value">{counts[s]}</div>
                  <div className="stat-label">{STATUS_LABELS[s]}</div>
                </div>
              );
            })}
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              Nenhuma ordem de serviço registrada ainda.{" "}
              <Link to={`/painel/${tenantId}/nova`}>Abrir a primeira</Link>.
            </div>
          ) : (
            <div className="overview-grid">
              <div className="card">
                <div className="card-title">Ordens recentes</div>
                {recentes.map((o) => (
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

              <div>
                <div className="card">
                  <div className="card-title">Distribuição por status</div>
                  <div className="distribution-bar">
                    {STATUS_ORDER.map((s) =>
                      counts[s] > 0 ? (
                        <div
                          key={s}
                          style={{
                            width: `${(counts[s] / orders.length) * 100}%`,
                            background: STATUS_COLOR_VAR[s],
                          }}
                        />
                      ) : null
                    )}
                  </div>
                  <div className="distribution-legend">
                    {STATUS_ORDER.map((s) => (
                      <div className="distribution-legend-item" key={s}>
                        <span className="dot-label">
                          <span className="dot" style={{ background: STATUS_COLOR_VAR[s] }} />
                          {STATUS_LABELS[s]}
                        </span>
                        <span className="count">{counts[s]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Ações rápidas</div>
                  <div className="quick-actions">
                    <Link to={`/painel/${tenantId}/nova`} className="btn">
                      + Nova OS
                    </Link>
                    <Link to={`/painel/${tenantId}`} className="btn btn-secondary">
                      Ver todas as OS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
