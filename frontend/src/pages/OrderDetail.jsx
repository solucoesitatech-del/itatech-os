import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusTimeline from "../components/StatusTimeline.jsx";
import OrderInfoCard from "../components/OrderInfoCard.jsx";
import TrackingLinkCard from "../components/TrackingLinkCard.jsx";

export default function OrderDetail() {
  const { tenantId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [itens, setItens] = useState([{ descricao: "", valor: "" }]);
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false);

  function carregar() {
    api.getOrder(orderId).then(setOrder);
  }

  useEffect(carregar, [orderId]);

  if (!order) {
    return (
      <Layout tenantId={tenantId} active="orders">
        <p className="subtle">Carregando ficha...</p>
      </Layout>
    );
  }

  const linkPublico = `${window.location.origin}/acompanhar/${order.token_publico}`;

  async function avancarStatus(novo) {
    const atualizado = await api.updateStatus(orderId, novo);
    setOrder(atualizado);
  }

  async function salvarOrcamento(e) {
    e.preventDefault();
    setSalvandoOrcamento(true);
    const itensValidos = itens
      .filter((i) => i.descricao && i.valor)
      .map((i) => ({ descricao: i.descricao, valor: parseFloat(i.valor) }));
    const atualizado = await api.setBudget(orderId, itensValidos);
    setOrder(atualizado);
    setSalvandoOrcamento(false);
  }

  const atualizadoEm = order.atualizado_em
    ? new Date(order.atualizado_em).toLocaleString("pt-BR")
    : null;

  return (
    <Layout tenantId={tenantId} active="orders">
      <Link to={`/painel/${tenantId}`} className="back-link no-print">
        ← Voltar para Ordens
      </Link>

      <div className="detail-header">
        <div className="detail-header-left">
          <span className="detail-os-number">OS #{order.numero_os.replace(/^OS-/, "")}</span>
          <StatusBadge status={order.status} />
        </div>
        <button className="btn btn-secondary no-print" onClick={() => window.print()}>
          Imprimir OS
        </button>
      </div>

      <OrderInfoCard title="Serviço / Equipamento">
        <div className="faint" style={{ marginBottom: 4 }}>Defeito relatado</div>
        <p style={{ margin: 0 }}>{order.defeito_relatado}</p>
      </OrderInfoCard>

      <div className="card">
        <div className="card-title">Status</div>
        <StatusBadge status={order.status} large />
        {atualizadoEm && (
          <p className="faint" style={{ marginTop: 10, marginBottom: 0 }}>
            Última atualização: {atualizadoEm}
          </p>
        )}

        <div className="no-print" style={{ marginTop: 20 }}>
          <StatusTimeline status={order.status} onSelect={avancarStatus} />
        </div>
      </div>

      <TrackingLinkCard link={linkPublico} />

      <div className="card">
        <div className="card-title">Orçamento</div>
        {order.orcamento?.itens?.length > 0 ? (
          <>
            <table className="budget-table">
              <tbody>
                {order.orcamento.itens.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.descricao}</td>
                    <td style={{ textAlign: "right" }}>R$ {i.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="budget-total">
              Total: R$ {order.orcamento.valor_total.toFixed(2)}
            </div>
            <p className="subtle">
              {order.orcamento.aprovado
                ? "Orçamento aprovado pelo cliente."
                : "Aguardando aprovação do cliente pelo link."}
            </p>
          </>
        ) : (
          <form onSubmit={salvarOrcamento} className="no-print">
            {itens.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  placeholder="Descrição (ex: peça, mão de obra)"
                  value={item.descricao}
                  onChange={(e) => {
                    const novos = [...itens];
                    novos[idx].descricao = e.target.value;
                    setItens(novos);
                  }}
                />
                <input
                  placeholder="Valor"
                  type="number"
                  step="0.01"
                  style={{ maxWidth: 110 }}
                  value={item.valor}
                  onChange={(e) => {
                    const novos = [...itens];
                    novos[idx].valor = e.target.value;
                    setItens(novos);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: 16 }}
              onClick={() => setItens([...itens, { descricao: "", valor: "" }])}
            >
              + item
            </button>
            <br />
            <button className="btn" type="submit" disabled={salvandoOrcamento}>
              {salvandoOrcamento ? "Salvando..." : "Salvar orçamento"}
            </button>
          </form>
        )}
      </div>

      <div className="signature-line">Assinatura do cliente</div>
    </Layout>
  );
}
