import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import Layout from "../components/Layout.jsx";

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
    <Layout tenantId={tenantId} active="clients">
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p className="subtle">
            {customers.length}{" "}
            {customers.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}
          </p>
        </div>
        {!showForm && (
          <button className="btn" onClick={() => setShowForm(true)}>
            + Novo cliente
          </button>
        )}
      </div>

      {loading && <p className="subtle">Carregando...</p>}

      {showForm && (
        <form onSubmit={salvar} className="card">
          <div className="card-title">Novo cliente</div>
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
            <input id="endereco" value={form.endereco} onChange={set("endereco")} />
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

      {!loading && customers.length === 0 && !showForm && (
        <div className="empty-state">
          Nenhum cliente ainda. Cadastre um cliente aqui, ou pelo formulário de
          "Nova OS" mesmo.
        </div>
      )}

      {customers.length > 0 && (
        <div className="card">
          {customers.map((c) => (
            <div key={c.id} className="card-list-item">
              <div>
                <div className="card-list-os">{c.nome}</div>
                <div className="card-list-meta">
                  {c.telefone}
                  {c.email ? ` · ${c.email}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
