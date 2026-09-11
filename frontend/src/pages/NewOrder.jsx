import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import Header from "../components/Header.jsx";

const initialNewCustomer = { clienteNome: "", clienteTelefone: "" };
const initialNewEquipment = { equipTipo: "", equipMarca: "", equipModelo: "" };

export default function NewOrder() {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [customerMode, setCustomerMode] = useState("novo");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [newCustomer, setNewCustomer] = useState(initialNewCustomer);

  const [customerEquipment, setCustomerEquipment] = useState([]);
  const [equipmentMode, setEquipmentMode] = useState("novo");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [newEquipment, setNewEquipment] = useState(initialNewEquipment);

  const [defeito, setDefeito] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.listCustomers(tenantId).then(setCustomers);
  }, [tenantId]);

  useEffect(() => {
    if (customerMode === "existente" && selectedCustomerId) {
      api.listCustomerEquipment(selectedCustomerId).then((eq) => {
        setCustomerEquipment(eq);
        setEquipmentMode(eq.length > 0 ? "existente" : "novo");
        setSelectedEquipmentId(eq.length > 0 ? eq[0].id : "");
      });
    } else {
      setCustomerEquipment([]);
      setEquipmentMode("novo");
      setSelectedEquipmentId("");
    }
  }, [customerMode, selectedCustomerId]);

  const setNC = (campo) => (e) =>
    setNewCustomer({ ...newCustomer, [campo]: e.target.value });
  const setNE = (campo) => (e) =>
    setNewEquipment({ ...newEquipment, [campo]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      let customerId = selectedCustomerId;
      if (customerMode === "novo") {
        const customer = await api.createCustomer({
          tenant_id: tenantId,
          nome: newCustomer.clienteNome,
          telefone: newCustomer.clienteTelefone,
        });
        customerId = customer.id;
      }

      let equipmentId = selectedEquipmentId;
      if (equipmentMode === "novo") {
        const equipment = await api.createEquipment({
          tenant_id: tenantId,
          customer_id: customerId,
          tipo: newEquipment.equipTipo,
          marca: newEquipment.equipMarca || null,
          modelo: newEquipment.equipModelo || null,
        });
        equipmentId = equipment.id;
      }

      const order = await api.createOrder({
        tenant_id: tenantId,
        customer_id: customerId,
        equipment_id: equipmentId,
        defeito_relatado: defeito,
      });
      navigate(`/painel/${tenantId}/os/${order.id}`);
    } catch (e2) {
      setErro(e2.message);
      setSalvando(false);
    }
  }

  const podeEnviar =
    (customerMode === "existente" ? !!selectedCustomerId : !!newCustomer.clienteNome && !!newCustomer.clienteTelefone) &&
    (equipmentMode === "existente" ? !!selectedEquipmentId : !!newEquipment.equipTipo) &&
    !!defeito;

  return (
    <div className="app-shell">
      <Header eyebrow="nova ficha" />

      <h1>Nova ordem de serviço</h1>

      <form onSubmit={handleSubmit}>
        <h2>Cliente</h2>
        {customers.length > 0 && (
          <div className="toggle-row">
            <button
              type="button"
              className={customerMode === "novo" ? "btn btn-toggle active" : "btn btn-toggle"}
              onClick={() => setCustomerMode("novo")}
            >
              Novo cliente
            </button>
            <button
              type="button"
              className={customerMode === "existente" ? "btn btn-toggle active" : "btn btn-toggle"}
              onClick={() => setCustomerMode("existente")}
            >
              Cliente já cadastrado
            </button>
          </div>
        )}

        {customerMode === "existente" ? (
          <div className="field">
            <label htmlFor="clienteExistente">Selecione o cliente</label>
            <select
              id="clienteExistente"
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Escolha...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} — {c.telefone}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="clienteNome">Nome</label>
              <input
                id="clienteNome"
                required
                value={newCustomer.clienteNome}
                onChange={setNC("clienteNome")}
              />
            </div>
            <div className="field">
              <label htmlFor="clienteTelefone">Telefone (WhatsApp)</label>
              <input
                id="clienteTelefone"
                required
                placeholder="(11) 99999-0000"
                value={newCustomer.clienteTelefone}
                onChange={setNC("clienteTelefone")}
              />
            </div>
          </>
        )}

        <h2>Equipamento</h2>
        {customerMode === "existente" && customerEquipment.length > 0 && (
          <div className="toggle-row">
            <button
              type="button"
              className={equipmentMode === "existente" ? "btn btn-toggle active" : "btn btn-toggle"}
              onClick={() => setEquipmentMode("existente")}
            >
              Equipamento já cadastrado
            </button>
            <button
              type="button"
              className={equipmentMode === "novo" ? "btn btn-toggle active" : "btn btn-toggle"}
              onClick={() => setEquipmentMode("novo")}
            >
              Novo equipamento
            </button>
          </div>
        )}

        {equipmentMode === "existente" ? (
          <div className="field">
            <label htmlFor="equipExistente">Selecione o equipamento</label>
            <select
              id="equipExistente"
              required
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
            >
              {customerEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.tipo} {eq.marca ? `— ${eq.marca}` : ""} {eq.modelo || ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="equipTipo">Tipo</label>
              <input
                id="equipTipo"
                required
                placeholder="Notebook, câmera, moto..."
                value={newEquipment.equipTipo}
                onChange={setNE("equipTipo")}
              />
            </div>
            <div className="field">
              <label htmlFor="equipMarca">Marca</label>
              <input id="equipMarca" value={newEquipment.equipMarca} onChange={setNE("equipMarca")} />
            </div>
            <div className="field">
              <label htmlFor="equipModelo">Modelo</label>
              <input id="equipModelo" value={newEquipment.equipModelo} onChange={setNE("equipModelo")} />
            </div>
          </>
        )}

        <h2>Defeito relatado</h2>
        <div className="field">
          <textarea
            required
            value={defeito}
            onChange={(e) => setDefeito(e.target.value)}
            placeholder="Descreva o que o cliente relatou..."
          />
        </div>

        {erro && <p className="subtle">Não foi possível salvar: {erro}</p>}

        <button className="btn" type="submit" disabled={salvando || !podeEnviar}>
          {salvando ? "Salvando..." : "Abrir OS"}
        </button>
      </form>
    </div>
  );
}
