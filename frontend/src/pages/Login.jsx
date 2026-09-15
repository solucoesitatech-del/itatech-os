import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const ROOT_SUFFIX = ".itatech-os.com.br";

function detectarSubdominio() {
  const host = window.location.hostname;
  if (host.endsWith(ROOT_SUFFIX)) {
    const sub = host.slice(0, -ROOT_SUFFIX.length);
    if (sub && sub !== "www") return sub;
  }
  return "";
}

export default function Login() {
  const navigate = useNavigate();
  const [subdominio, setSubdominio] = useState(detectarSubdominio());
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [entrando, setEntrando] = useState(false);
  const [marca, setMarca] = useState(null); // { nome, logo_url } da oficina, se detectada pela URL

  useEffect(() => {
    if (!subdominio) return;
    api
      .getTenantBySubdomain(subdominio)
      .then((t) => setMarca({ nome: t.nome, logo_url: t.logo_url }))
      .catch(() => setMarca(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <img
              src={marca?.logo_url || "/logo.jpg"}
              alt={marca?.nome || "iTATech"}
              className="brand-logo"
            />
          </span>
          <span className="brand-name">{marca?.nome || "iTATech OS"}</span>
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
        <p className="faint" style={{ textAlign: "center", marginTop: 20 }}>
          Sistema by iTATech
        </p>
      </div>
    </div>
  );
}
