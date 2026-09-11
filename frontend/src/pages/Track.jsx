import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusTimeline from "../components/StatusTimeline.jsx";

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
          <img src="/logo.jpg" alt="iTATech" className="brand-logo" style={{ width: 40, height: 40 }} />
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
