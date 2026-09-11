import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const [subdominio, setSubdominio] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [entrando, setEntrando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setEntrando(true);
    setErro(null);
    try {
      const data = await api.login(subdominio.trim(), senha);
      navigate(`/painel/${data.tenant_id}/visao-geral`);
    } catch (e2) {
      setErro(e2.message);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="public-brand">
          <span className="brand-logo-chip" style={{ width: 40, height: 40 }}>
            <img src="/logo.jpg" alt="iTATech" className="brand-logo" />
          </span>
          <span className="brand-name">iTATech OS</span>
        </div>
        <p className="subtle" style={{ textAlign: "center", marginBottom: 20 }}>
          Entre com o subdomínio e a senha da sua oficina.
        </p>
        <form onSubmit={entrar}>
          <div className="field">
            <label htmlFor="subdominio">Subdomínio</label>
            <input
              id="subdominio"
              required
              autoFocus
              placeholder="ex: joaoinformatica"
              value={subdominio}
              onChange={(e) => setSubdominio(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {erro && <p className="subtle" style={{ color: "var(--danger)" }}>{erro}</p>}
          <button className="btn" type="submit" disabled={entrando} style={{ width: "100%" }}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
