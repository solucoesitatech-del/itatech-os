import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import Layout from "../components/Layout.jsx";

export default function Configuracoes() {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({ nome: "", categoria: "", telefone: "", whatsapp: "" });
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    api.getTenant(tenantId).then((t) => {
      setTenant(t);
      setForm({
        nome: t.nome || "",
        categoria: t.categoria || "",
        telefone: t.telefone || "",
        whatsapp: t.whatsapp || "",
      });
    });
  }, [tenantId]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setSalvo(false);
    const atualizado = await api.updateTenant(tenantId, form);
    setTenant(atualizado);
    setSalvando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  return (
    <Layout tenantId={tenantId} active="config">
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p className="subtle">Dados da oficina exibidos para os clientes.</p>
        </div>
      </div>

      {!tenant && <p className="subtle">Carregando...</p>}

      {tenant && (
        <form onSubmit={salvar} className="card">
          <div className="card-title">Dados da oficina</div>

          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" required value={form.nome} onChange={set("nome")} />
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <input id="categoria" required value={form.categoria} onChange={set("categoria")} />
          </div>

          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" value={form.telefone} onChange={set("telefone")} />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input id="whatsapp" value={form.whatsapp} onChange={set("whatsapp")} />
          </div>

          <div className="field">
            <label htmlFor="subdominio">Subdomínio</label>
            <input id="subdominio" value={tenant.subdominio} disabled />
            <p className="faint" style={{ marginTop: 6 }}>
              O subdomínio identifica sua oficina no sistema e não pode ser
              alterado por aqui.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
            {salvo && <span className="subtle" style={{ color: "var(--status-pronto)" }}>Salvo!</span>}
          </div>
        </form>
      )}
    </Layout>
  );
}
