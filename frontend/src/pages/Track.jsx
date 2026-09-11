import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusTimeline from "../components/StatusTimeline.jsx";

function TagMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5 Q16 0 21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6 H24 V19 L16 28 L8 19 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

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
      <div className="public-page">
        <div className="public-card">
          <div className="empty-state">
            Não encontramos essa ordem de serviço. Confira o link recebido.
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="public-page">
        <div className="public-card">
          <p className="subtle" style={{ textAlign: "center" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  async function aprovar() {
    setAprovando(true);
    const atualizado = await api.approveBudget(token);
    setOrder(atualizado);
    setAprovando(false);
  }

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="public-brand">
          <span style={{ color: "var(--accent)" }}>
            <TagMark />
          </span>
          <span className="brand-name">iTATech OS</span>
        </div>

        <div className="public-os-number">OS #{order.numero_os.replace(/^OS-/, "")}</div>
        <p className="public-defeito">{order.defeito_relatado}</p>

        <div className="public-status-wrap">
          <StatusBadge status={order.status} large />
        </div>

        <StatusTimeline status={order.status} readOnly />

        {order.orcamento?.itens?.length > 0 && (
          <div className="card" style={{ boxShadow: "none", marginTop: 24 }}>
            <div className="card-title">Orçamento</div>
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
              <p className="subtle" style={{ color: "var(--status-pronto)" }}>
                Orçamento aprovado. Obrigado!
              </p>
            ) : (
              <button className="btn" onClick={aprovar} disabled={aprovando} style={{ width: "100%" }}>
                {aprovando ? "Aprovando..." : "Aprovar orçamento"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
