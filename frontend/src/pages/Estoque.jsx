import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import Layout from "../components/Layout.jsx";

const initialForm = { nome: "", quantidade: "0", quantidade_minima: "0", preco_unitario: "" };

export default function Estoque() {
  const { tenantId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .listStockItems(tenantId)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(carregar, [tenantId]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    await api.createStockItem({
      tenant_id: tenantId,
      nome: form.nome,
      quantidade: parseInt(form.quantidade, 10) || 0,
      quantidade_minima: parseInt(form.quantidade_minima, 10) || 0,
      preco_unitario: form.preco_unitario ? parseFloat(form.preco_unitario) : null,
    });
    setForm(initialForm);
    setShowForm(false);
    setSalvando(false);
    carregar();
  }

  async function ajustarQuantidade(item, delta) {
    const novaQtd = Math.max(0, item.quantidade + delta);
    const atualizado = await api.updateStockItem(item.id, { quantidade: novaQtd });
    setItems(items.map((i) => (i.id === item.id ? atualizado : i)));
  }

  async function excluir(itemId) {
    await api.deleteStockItem(itemId);
    setItems(items.filter((i) => i.id !== itemId));
  }

  return (
    <Layout tenantId={tenantId} active="estoque">
      <div className="page-header">
        <div>
          <h1>Estoque</h1>
          <p className="subtle">Peças e componentes usados nos reparos.</p>
        </div>
        {!showForm && (
          <button className="btn" onClick={() => setShowForm(true)}>
            + Novo item
          </button>
        )}
      </div>

      {loading && <p className="subtle">Carregando...</p>}

      {showForm && (
        <form onSubmit={salvar} className="card">
          <div className="card-title">Novo item</div>
          <div className="field">
            <label htmlFor="nome">Nome da peça</label>
            <input id="nome" required value={form.nome} onChange={set("nome")} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="quantidade">Quantidade</label>
              <input
                id="quantidade"
                type="number"
                min="0"
                value={form.quantidade}
                onChange={set("quantidade")}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="quantidade_minima">Estoque mínimo</label>
              <input
                id="quantidade_minima"
                type="number"
                min="0"
                value={form.quantidade_minima}
                onChange={set("quantidade_minima")}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="preco">Preço unitário (opcional)</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={form.preco_unitario}
              onChange={set("preco_unitario")}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar item"}
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

      {!loading && items.length === 0 && !showForm && (
        <div className="empty-state">Nenhum item cadastrado no estoque ainda.</div>
      )}

      {items.length > 0 && (
        <div className="card">
          {items.map((item) => {
            const baixo = item.quantidade_minima > 0 && item.quantidade <= item.quantidade_minima;
            return (
              <div key={item.id} className="card-list-item">
                <div>
                  <div className="card-list-os">{item.nome}</div>
                  <div className="card-list-meta">
                    {item.preco_unitario != null ? `R$ ${item.preco_unitario.toFixed(2)} un.` : ""}
                    {baixo && <span className="low-stock-badge" style={{ marginLeft: 8 }}>estoque baixo</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="qty-control">
                    <button
                      className="btn btn-secondary qty-btn"
                      onClick={() => ajustarQuantidade(item, -1)}
                      type="button"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantidade}</span>
                    <button
                      className="btn btn-secondary qty-btn"
                      onClick={() => ajustarQuantidade(item, 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => excluir(item.id)}
                    type="button"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
