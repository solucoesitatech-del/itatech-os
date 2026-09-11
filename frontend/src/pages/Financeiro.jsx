import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, PAYMENT_STATUS_LABELS } from "../api.js";
import Layout from "../components/Layout.jsx";

export default function Financeiro() {
  const { tenantId } = useParams();
  const [payments, setPayments] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState(null);

  function carregar() {
    const agora = new Date();
    Promise.all([
      api.listPayments(tenantId),
      api.monthlyReport(tenantId, agora.getFullYear(), agora.getMonth() + 1),
    ])
      .then(([p, r]) => {
        setPayments(p.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)));
        setRelatorio(r);
      })
      .finally(() => setLoading(false));
  }

  useEffect(carregar, [tenantId]);

  async function marcarPago(id) {
    setAtualizandoId(id);
    await api.markPaymentPaid(id);
    await carregar();
    setAtualizandoId(null);
  }

  return (
    <Layout tenantId={tenantId} active="financeiro">
      <div className="page-header">
        <div>
          <h1>Financeiro</h1>
          <p className="subtle">Pagamentos das ordens de serviço.</p>
        </div>
      </div>

      {loading && <p className="subtle">Carregando...</p>}

      {!loading && relatorio && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">
              R$ {relatorio.total_faturado.toFixed(2)}
            </div>
            <div className="stat-label">Faturado este mês ({relatorio.periodo})</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{relatorio.quantidade_pagamentos}</div>
            <div className="stat-label">Pagamentos recebidos este mês</div>
          </div>
        </div>
      )}

      {!loading && payments.length === 0 && (
        <div className="empty-state">
          Nenhum pagamento registrado ainda. Registre uma cobrança a partir do
          orçamento de uma ordem de serviço.
        </div>
      )}

      {payments.length > 0 && (
        <div className="card">
          {payments.map((p) => (
            <div key={p.id} className="card-list-item">
              <div>
                <div className="card-list-os">R$ {p.valor.toFixed(2)}</div>
                <div className="card-list-meta">
                  {p.forma ? `${p.forma} · ` : ""}
                  {new Date(p.criado_em).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className={`status-badge status-${p.status}`}>
                  <span className="dot" />
                  {PAYMENT_STATUS_LABELS[p.status]}
                </span>
                {p.status !== "pago" && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => marcarPago(p.id)}
                    disabled={atualizandoId === p.id}
                  >
                    {atualizandoId === p.id ? "Salvando..." : "Marcar como pago"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
