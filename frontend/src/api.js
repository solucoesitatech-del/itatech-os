const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Tenant
  getTenant: (id) => request(`/api/tenants/${id}`),
  updateTenant: (id, data) =>
    request(`/api/tenants/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // Clientes
  listCustomers: (tenantId) => request(`/api/customers/tenant/${tenantId}`),
  createCustomer: (data) =>
    request(`/api/customers/`, { method: "POST", body: JSON.stringify(data) }),
  listCustomerEquipment: (customerId) =>
    request(`/api/customers/${customerId}/equipamentos`),

  // Equipamentos
  createEquipment: (data) =>
    request(`/api/equipment/`, { method: "POST", body: JSON.stringify(data) }),

  // Ordens de serviço
  listOrders: (tenantId) => request(`/api/service-orders/tenant/${tenantId}`),
  getOrder: (id) => request(`/api/service-orders/${id}`),
  createOrder: (data) =>
    request(`/api/service-orders/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id, novo_status) =>
    request(`/api/service-orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ novo_status }),
    }),
  setBudget: (id, itens) =>
    request(`/api/service-orders/${id}/orcamento`, {
      method: "POST",
      body: JSON.stringify(itens),
    }),

  // Acompanhamento público
  trackOrder: (token) => request(`/api/acompanhar/${token}`),
  approveBudget: (token) =>
    request(`/api/acompanhar/${token}/aprovar-orcamento`, { method: "POST" }),

  // Financeiro (pagamentos)
  createPayment: (data) =>
    request(`/api/payments/`, { method: "POST", body: JSON.stringify(data) }),
  markPaymentPaid: (id) =>
    request(`/api/payments/${id}/pagar`, { method: "PATCH" }),
  listPayments: (tenantId) => request(`/api/payments/tenant/${tenantId}`),
  monthlyReport: (tenantId, ano, mes) =>
    request(`/api/payments/tenant/${tenantId}/relatorio-mensal?ano=${ano}&mes=${mes}`),

  // Estoque
  listStockItems: (tenantId) => request(`/api/stock/tenant/${tenantId}`),
  createStockItem: (data) =>
    request(`/api/stock/`, { method: "POST", body: JSON.stringify(data) }),
  updateStockItem: (id, data) =>
    request(`/api/stock/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteStockItem: (id) => request(`/api/stock/${id}`, { method: "DELETE" }),
};

export const STATUS_LABELS = {
  recebido: "Recebido",
  em_analise: "Em análise",
  aguardando_peca: "Aguardando peça",
  pronto: "Pronto",
  entregue: "Entregue",
};

export const STATUS_ORDER = [
  "recebido",
  "em_analise",
  "aguardando_peca",
  "pronto",
  "entregue",
];

export const PAYMENT_STATUS_LABELS = {
  pendente: "Pendente",
  pago: "Pago",
  atrasado: "Atrasado",
};
