import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, STATUS_LABELS, STATUS_ORDER } from "../api.js";
import Header from "../components/Header.jsx";

export default function OrderDetail() {
  const { tenantId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [itens, setItens] = useState([{ descricao: "", valor: "" }]);
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false);
  const [copiado, setCopiado] = useState(false);

  function carregar() {
    api.getOrder(orderId).then(setOrder);
  }

  useEffect(carregar, [orderId]);

  if (!order) {
    return (
      <div className="app-shell">
        <p className="subtle">Carregando ficha...</p>
      </div>
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

  function copiarLink() {
    navigator.clipboard.writeText(linkPublico);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="app-shell">
      <Header right={order.numero_os} eyebrow="ficha da OS" />

      <div className="toolbar no-print">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Imprimir OS
        </button>
      </div>

      <span className={`status-tag status-${order.status}`}>
        {STATUS_LABELS[order.status]}
      </span>

      <h1 style={{ marginTop: 12 }}>Defeito relatado</h1>
      <p>{order.defeito_relatado}</p>

      <div className="no-print">
        <h2>Avançar status</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              className={s === order.status ? "btn" : "btn btn-secondary"}
              onClick={() => avancarStatus(s)}
              disabled={s === order.status}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <h2>Link de acompanhamento</h2>
      <p className="subtle no-print">
        Envie esse link pelo WhatsApp — o cliente acompanha o status sem precisar
        perguntar.
      </p>
      <div className="ticket link-box">
        <span>{linkPublico}</span>
        <button className="btn btn-secondary no-print" onClick={copiarLink}>
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>

      <h2 style={{ marginTop: 24 }}>Orçamento</h2>
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
            className="btn btn-secondary"
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

      <div className="signature-line">
        <span>Assinatura do cliente</span>
      </div>
    </div>
  );
}
