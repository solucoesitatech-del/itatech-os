import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import Header from "../components/Header.jsx";

const initialForm = { nome: "", telefone: "", email: "", endereco: "" };

export default function Customers() {
  const { tenantId } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .listCustomers(tenantId)
      .then(setCustomers)
      .finally(() => setLoading(false));
  }

  useEffect(carregar, [tenantId]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    await api.createCustomer({ tenant_id: tenantId, ...form });
    setForm(initialForm);
    setShowForm(false);
    setSalvando(false);
    carregar();
  }

  return (
    <div className="app-shell">
      <Header eyebrow="clientes cadastrados" />

      <Link to={`/painel/${tenantId}`} className="back-link">
        ← Ordens de serviço
      </Link>

      <h1>Clientes</h1>
      <p className="subtle">
        {customers.length}{" "}
        {customers.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}
      </p>

      {loading && <p className="subtle">Carregando...</p>}

      {!loading && customers.length === 0 && !showForm && (
        <div className="empty-state">
          Nenhum cliente ainda. Cadastre um cliente aqui, ou pelo formulário de
          "Nova OS" mesmo.
        </div>
      )}

      {customers.map((c) => (
        <div key={c.id} className="ticket">
          <div className="ticket-row">
            <div>
              <div className="ticket-os">{c.nome}</div>
              <div className="ticket-meta">{c.telefone}</div>
              {c.email && <div className="ticket-meta">{c.email}</div>}
            </div>
          </div>
        </div>
      ))}

      {!showForm && (
        <button className="btn btn-secondary" onClick={() => setShowForm(true)}>
          + Novo cliente
        </button>
      )}

      {showForm && (
        <form onSubmit={salvar} className="ticket">
          <h2 style={{ marginTop: 0 }}>Novo cliente</h2>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" required value={form.nome} onChange={set("nome")} />
          </div>
          <div className="field">
            <label htmlFor="telefone">Telefone (WhatsApp)</label>
            <input
              id="telefone"
              required
              placeholder="(11) 99999-0000"
              value={form.telefone}
              onChange={set("telefone")}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email (opcional)</label>
            <input id="email" value={form.email} onChange={set("email")} />
          </div>
          <div className="field">
            <label htmlFor="endereco">Endereço (opcional)</label>
            <input
              id="endereco"
              value={form.endereco}
              onChange={set("endereco")}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar cliente"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
