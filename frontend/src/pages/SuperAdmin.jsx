import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

const SESSION_KEY = "itatech_superadmin_auth";
const initialForm = { nome: "", subdominio: "", categoria: "", telefone: "", whatsapp: "" };

function LoginGate({ onSuccess }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);

  function entrar(e) {
    e.preventDefault();
    const senhaCorreta = import.meta.env.VITE_SUPERADMIN_PASSWORD;
    if (!senhaCorreta) {
      setErro(
        "A variável VITE_SUPERADMIN_PASSWORD não foi configurada no deploy. Defina-a para liberar o acesso."
      );
      return;
    }
    if (senha === senhaCorreta) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setErro("Senha incorreta.");
    }
  }

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="public-brand">
          <span className="brand-logo-chip" style={{ width: 40, height: 40 }}>
            <img src="/logo.jpg" alt="iTATech" className="brand-logo" />
          </span>
          <span className="brand-name">Painel Administrativo</span>
        </div>
        <p className="subtle" style={{ textAlign: "center", marginBottom: 20 }}>
          Acesso restrito ao responsável pelo iTATech OS.
        </p>
        <form onSubmit={entrar}>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoFocus
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {erro && <p className="subtle" style={{ color: "var(--danger)" }}>{erro}</p>}
          <button className="btn" type="submit" style={{ width: "100%" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function Painel() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [criado, setCriado] = useState(null);

  function carregar() {
    api
      .listTenants()
      .then(setTenants)
      .finally(() => setLoading(false));
  }

  useEffect(carregar, []);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      const novo = await api.createTenant(form);
      setCriado(novo);
      setForm(initialForm);
      setShowForm(false);
      carregar();
    } catch (e2) {
      setErro(e2.message);
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="superadmin-header">
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="brand-logo-chip" style={{ width: 28, height: 28 }}>
            <img src="/logo.jpg" alt="iTATech" className="brand-logo" />
          </span>
          <span className="brand-name">iTATech OS — Administração</span>
        </span>
        <button className="btn btn-secondary btn-sm" onClick={sair}>
          Sair
        </button>
      </div>

      <div className="superadmin-content">
        <div className="page-header">
          <div>
            <h1>Assistências técnicas</h1>
            <p className="subtle">
              {tenants.length}{" "}
              {tenants.length === 1 ? "oficina cadastrada" : "oficinas cadastradas"}
            </p>
          </div>
          {!showForm && (
            <button className="btn" onClick={() => { setShowForm(true); setCriado(null); }}>
              + Nova assistência técnica
            </button>
          )}
        </div>

        {criado && (
          <div className="card" style={{ borderLeft: "4px solid var(--status-pronto)" }}>
            <div className="card-title">Oficina criada com sucesso</div>
            <p style={{ marginTop: 0 }}>
              Envie este link para <strong>{criado.nome}</strong> acessar o painel dela:
            </p>
            <div className="link-field">
              {window.location.origin}/painel/{criado.id}
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={salvar} className="card">
            <div className="card-title">Nova assistência técnica</div>
            <div className="field">
              <label htmlFor="nome">Nome da oficina</label>
              <input id="nome" required value={form.nome} onChange={set("nome")} />
            </div>
            <div className="field">
              <label htmlFor="subdominio">Subdomínio (identificador único)</label>
              <input
                id="subdominio"
                required
                placeholder="ex: joaoinformatica"
                value={form.subdominio}
                onChange={set("subdominio")}
              />
            </div>
            <div className="field">
              <label htmlFor="categoria">Categoria</label>
              <input
                id="categoria"
                required
                placeholder="Informática, câmeras, moto, elétrica..."
                value={form.categoria}
                onChange={set("categoria")}
              />
            </div>
            <div className="field">
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" value={form.telefone} onChange={set("telefone")} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input id="whatsapp" value={form.whatsapp} onChange={set("whatsapp")} />
            </div>

            {erro && <p className="subtle" style={{ color: "var(--danger)" }}>Não foi possível salvar: {erro}</p>}

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : "Criar oficina"}
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

        {loading && <p className="subtle">Carregando...</p>}

        {!loading && tenants.length === 0 && !showForm && (
          <div className="empty-state">Nenhuma assistência técnica cadastrada ainda.</div>
        )}

        {tenants.length > 0 && (
          <div className="card">
            {tenants.map((t) => (
              <div key={t.id} className="card-list-item">
                <div>
                  <div className="card-list-os">{t.nome}</div>
                  <div className="card-list-meta">
                    {t.categoria} · {t.subdominio}
                  </div>
                </div>
                <Link to={`/painel/${t.id}`} className="btn btn-secondary btn-sm">
                  Abrir painel
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  if (!autenticado) {
    return <LoginGate onSuccess={() => setAutenticado(true)} />;
  }

  return <Painel />;
}
