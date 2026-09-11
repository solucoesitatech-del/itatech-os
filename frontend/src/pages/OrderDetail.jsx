import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, PAYMENT_STATUS_LABELS, STATUS_LABELS } from "../api.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusTimeline from "../components/StatusTimeline.jsx";
import OrderInfoCard from "../components/OrderInfoCard.jsx";
import TrackingLinkCard from "../components/TrackingLinkCard.jsx";
import { IconCheckCircle } from "../components/icons.jsx";

export default function OrderDetail() {
  const { tenantId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [itens, setItens] = useState([{ descricao: "", valor: "" }]);
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false);
  const [payment, setPayment] = useState(null);
  const [registrandoPagamento, setRegistrandoPagamento] = useState(false);
  const [marcandoPago, setMarcandoPago] = useState(false);

  function carregar() {
    api.getOrder(orderId).then(setOrder);
  }

  useEffect(carregar, [orderId]);

  useEffect(() => {
    if (order?.equipment_id) {
      api.getEquipment(order.equipment_id).then(setEquipment).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.equipment_id]);

  useEffect(() => {
    if (order) {
      api.listPayments(tenantId).then((payments) => {
        setPayment(payments.find((p) => p.service_order_id === order.id) || null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

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

  async function registrarPagamento() {
    setRegistrandoPagamento(true);
    const novoPagamento = await api.createPayment({
      service_order_id: order.id,
      tenant_id: tenantId,
      valor: order.orcamento.valor_total,
    });
    setPayment(novoPagamento);
    setRegistrandoPagamento(false);
  }

  async function marcarPagamentoPago() {
    setMarcandoPago(true);
    const atualizado = await api.markPaymentPaid(payment.id);
    setPayment(atualizado);
    setMarcandoPago(false);
  }

  const atualizadoEm = order.atualizado_em
    ? new Date(order.atualizado_em).toLocaleString("pt-BR")
    : null;

  const infoFields = [
    { label: "Equipamento", value: equipment?.tipo },
    { label: "Marca", value: equipment?.marca },
    { label: "Modelo", value: equipment?.modelo },
    { label: "Número de série", value: equipment?.numero_serie },
  ].filter((f) => f.value);

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

      <div className={`status-highlight-card status-${order.status}`}>
        <div className="status-highlight-icon">
          <IconCheckCircle />
        </div>
        <div>
          <div className="status-highlight-eyebrow">Status atual</div>
          <div className="status-highlight-label">
            {STATUS_LABELS[order.status].toUpperCase()}
          </div>
          {atualizadoEm && (
            <div className="faint">Última atualização: {atualizadoEm}</div>
          )}
        </div>
      </div>

      <OrderInfoCard title="Serviço / Equipamento">
        {infoFields.length > 0 && (
          <div className="info-grid" style={{ marginBottom: 16 }}>
            {infoFields.map((f) => (
              <div className="info-field" key={f.label}>
                <div className="label">{f.label}</div>
                <div className="value">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        <div className="info-field full">
          <div className="label">Defeito relatado</div>
          <div className="value">{order.defeito_relatado}</div>
        </div>
      </OrderInfoCard>

      <div className="card">
        <div className="card-title">Atualizar status</div>
        <div className="no-print">
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

            <div className="no-print" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {payment ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`status-badge status-${payment.status}`}>
                    <span className="dot" />
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </span>
                  {payment.status !== "pago" && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={marcarPagamentoPago}
                      disabled={marcandoPago}
                    >
                      {marcandoPago ? "Salvando..." : "Marcar como pago"}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={registrarPagamento}
                  disabled={registrandoPagamento}
                >
                  {registrandoPagamento ? "Registrando..." : "Registrar cobrança no financeiro"}
                </button>
              )}
            </div>
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
