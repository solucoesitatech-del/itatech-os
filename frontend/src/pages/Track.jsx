import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, STATUS_LABELS, STATUS_ORDER } from "../api.js";
import Header from "../components/Header.jsx";

export default function Track() {
  const { token } = useParams();
  const [order, setOrder] = useState(null);
  const [erro, setErro] = useState(null);
  const [aprovando, setAprovando] = useState(false);

  useEffect(() => {
    api.trackOrder(token).then(setOrder).catch((e) => setErro(e.message));
  }, [token]);

  if (erro) {
    return (
      <div className="app-shell">
        <div className="empty-state">
          Não encontramos essa ordem de serviço. Confira o link recebido.
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app-shell">
        <p className="subtle">Carregando...</p>
      </div>
    );
  }

  const passoAtual = STATUS_ORDER.indexOf(order.status);

  async function aprovar() {
    setAprovando(true);
    const atualizado = await api.approveBudget(token);
    setOrder(atualizado);
    setAprovando(false);
  }

  return (
    <div className="app-shell">
      <Header right={order.numero_os} eyebrow="acompanhamento" />

      <h1>Acompanhamento do serviço</h1>
      <p className="subtle">{order.defeito_relatado}</p>

      <ol className="timeline">
        {STATUS_ORDER.map((status, idx) => {
          const classe =
            idx < passoAtual ? "done" : idx === passoAtual ? "current" : "";
          return (
            <li key={status} className={classe}>
              <div className="step-label">{STATUS_LABELS[status]}</div>
              {idx === passoAtual && (
                <div className="step-date">status atual</div>
              )}
            </li>
          );
        })}
      </ol>

      {order.orcamento?.itens?.length > 0 && (
        <>
          <h2>Orçamento</h2>
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

          {order.orcamento.aprovado ? (
            <p className="subtle" style={{ color: "var(--copper)" }}>
              Orçamento aprovado. Obrigado!
            </p>
          ) : (
            <button className="btn" onClick={aprovar} disabled={aprovando}>
              {aprovando ? "Aprovando..." : "Aprovar orçamento"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
