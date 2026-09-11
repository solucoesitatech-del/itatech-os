import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import Header from "../components/Header.jsx";

const initialState = {
  clienteNome: "",
  clienteTelefone: "",
  equipTipo: "",
  equipMarca: "",
  equipModelo: "",
  defeito: "",
};

export default function NewOrder() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const set = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      const customer = await api.createCustomer({
        tenant_id: tenantId,
        nome: form.clienteNome,
        telefone: form.clienteTelefone,
      });
      const equipment = await api.createEquipment({
        tenant_id: tenantId,
        customer_id: customer.id,
        tipo: form.equipTipo,
        marca: form.equipMarca || null,
        modelo: form.equipModelo || null,
      });
      const order = await api.createOrder({
        tenant_id: tenantId,
        customer_id: customer.id,
        equipment_id: equipment.id,
        defeito_relatado: form.defeito,
      });
      navigate(`/painel/${tenantId}/os/${order.id}`);
    } catch (e2) {
      setErro(e2.message);
      setSalvando(false);
    }
  }

  return (
    <div className="app-shell">
      <Header eyebrow="nova ficha" />

      <h1>Nova ordem de serviço</h1>

      <form onSubmit={handleSubmit}>
        <h2>Cliente</h2>
        <div className="field">
          <label htmlFor="clienteNome">Nome</label>
          <input
            id="clienteNome"
            required
            value={form.clienteNome}
            onChange={set("clienteNome")}
          />
        </div>
        <div className="field">
          <label htmlFor="clienteTelefone">Telefone (WhatsApp)</label>
          <input
            id="clienteTelefone"
            required
            placeholder="(11) 99999-0000"
            value={form.clienteTelefone}
            onChange={set("clienteTelefone")}
          />
        </div>

        <h2>Equipamento</h2>
        <div className="field">
          <label htmlFor="equipTipo">Tipo</label>
          <input
            id="equipTipo"
            required
            placeholder="Notebook, câmera, moto..."
            value={form.equipTipo}
            onChange={set("equipTipo")}
          />
        </div>
        <div className="field">
          <label htmlFor="equipMarca">Marca</label>
          <input id="equipMarca" value={form.equipMarca} onChange={set("equipMarca")} />
        </div>
        <div className="field">
          <label htmlFor="equipModelo">Modelo</label>
          <input id="equipModelo" value={form.equipModelo} onChange={set("equipModelo")} />
        </div>

        <h2>Defeito relatado</h2>
        <div className="field">
          <textarea
            required
            value={form.defeito}
            onChange={set("defeito")}
            placeholder="Descreva o que o cliente relatou..."
          />
        </div>

        {erro && <p className="subtle">Não foi possível salvar: {erro}</p>}

        <button className="btn" type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Abrir OS"}
        </button>
      </form>
    </div>
  );
}
