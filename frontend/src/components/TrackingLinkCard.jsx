import React, { useState } from "react";
import { IconCopy, IconCheck, IconWhatsapp } from "./icons.jsx";

export default function TrackingLinkCard({ link, phone }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const mensagem = encodeURIComponent(
    `Olá! Você pode acompanhar o andamento da sua Ordem de Serviço pelo link abaixo: ${link}`
  );
  const digitos = phone ? phone.replace(/\D/g, "") : "";
  const whatsappUrl = digitos
    ? `https://wa.me/55${digitos}?text=${mensagem}`
    : `https://wa.me/?text=${mensagem}`;

  return (
    <div className="card no-print">
      <div className="card-title">🔗 Link de acompanhamento</div>
      <p className="subtle" style={{ marginTop: 0 }}>
        Envie este link ao cliente para que ele acompanhe a OS sem precisar
        perguntar pelo WhatsApp.
      </p>
      <div className="link-field">{link}</div>
      <div className="link-actions">
        <button className="btn btn-secondary btn-sm" onClick={copiar}>
          {copiado ? <IconCheck /> : <IconCopy />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
        <a
          className="btn btn-sm"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          style={{ background: "#25d366", textDecoration: "none" }}
        >
          <IconWhatsapp />
          Enviar pelo WhatsApp
        </a>
      </div>
    </div>
  );
}
