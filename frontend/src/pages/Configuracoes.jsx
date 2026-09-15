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

  const [enviandoLogo, setEnviandoLogo] = useState(false);
  const [erroLogo, setErroLogo] = useState(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState(null);
  const [senhaTrocada, setSenhaTrocada] = useState(false);

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

  async function enviarLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErroLogo(null);
    setEnviandoLogo(true);
    try {
      const { logo_url } = await api.uploadLogo(tenantId, file);
      setTenant((t) => ({ ...t, logo_url }));
    } catch (e2) {
      setErroLogo(e2.message);
    } finally {
      setEnviandoLogo(false);
      e.target.value = "";
    }
  }

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

  async function trocarSenha(e) {
    e.preventDefault();
    setErroSenha(null);
    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 4) {
      setErroSenha("Use uma senha com pelo menos 4 caracteres.");
      return;
    }
    setTrocandoSenha(true);
    try {
      await api.changePassword(tenantId, novaSenha);
      setNovaSenha("");
      setConfirmarSenha("");
      setSenhaTrocada(true);
      setTimeout(() => setSenhaTrocada(false), 2500);
    } catch (e2) {
      setErroSenha(e2.message);
    } finally {
      setTrocandoSenha(false);
    }
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
            <label>Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="brand-logo-chip" style={{ width: 56, height: 56 }}>
                <img
                  src={tenant.logo_url || "/logo.jpg"}
                  alt={tenant.nome}
                  className="brand-logo"
                />
              </span>
              <div>
                <label htmlFor="logo-input" className="btn btn-secondary" style={{ cursor: "pointer" }}>
                  {enviandoLogo ? "Enviando..." : "Trocar logo"}
                </label>
                <input
                  id="logo-input"
                  type="file"
                  accept="image/*"
                  onChange={enviarLogo}
                  disabled={enviandoLogo}
                  style={{ display: "none" }}
                />
                <p className="faint" style={{ marginTop: 6 }}>
                  Aparece no seu painel e no link de acompanhamento enviado aos seus clientes.
                </p>
              </div>
            </div>
            {erroLogo && <p className="subtle" style={{ color: "var(--danger)" }}>{erroLogo}</p>}
          </div>

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

      {tenant && (
        <form onSubmit={trocarSenha} className="card">
          <div className="card-title">Senha de acesso</div>
          <div className="field">
            <label htmlFor="novaSenha">Nova senha</label>
            <input
              id="novaSenha"
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="confirmarSenha">Confirmar nova senha</label>
            <input
              id="confirmarSenha"
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          {erroSenha && <p className="subtle" style={{ color: "var(--danger)" }}>{erroSenha}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-secondary" type="submit" disabled={trocandoSenha}>
              {trocandoSenha ? "Salvando..." : "Trocar senha"}
            </button>
            {senhaTrocada && <span className="subtle" style={{ color: "var(--status-pronto)" }}>Senha atualizada!</span>}
          </div>
        </form>
      )}
    </Layout>
  );
}
