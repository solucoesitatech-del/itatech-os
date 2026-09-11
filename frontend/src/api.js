const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const AUTH_KEY = "itatech_auth";

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function setAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

async function request(path, options = {}) {
  const auth = getAuth();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (auth?.access_token) headers["Authorization"] = `Bearer ${auth.access_token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    clearAuth();
    if (!window.location.pathname.startsWith("/entrar")) {
      window.location.href = "/entrar";
    }
    throw new Error("Sessão expirada ou acesso negado");
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Erro ${res.status}`);
  }
  return res.json();
}

// Requisições do painel do dono (/superadmin) — usam a chave separada, não o token da oficina
async function superadminRequest(path, options = {}) {
  const key = import.meta.env.VITE_SUPERADMIN_PASSWORD;
  const headers = {
    "Content-Type": "application/json",
    "X-Superadmin-Key": key || "",
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Autenticação
  login: async (subdominio, senha) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdominio, senha }),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error(detail.detail || "Não foi possível entrar");
    }
    const data = await res.json();
    setAuth(data);
    return data;
  },
  changePassword: (tenantId, senha) =>
    request(`/api/tenants/${tenantId}/senha`, {
      method: "PATCH",
      body: JSON.stringify({ senha }),
    }),

  // Tenant
  getTenant: (id) => request(`/api/tenants/${id}`),
  updateTenant: (id, data) =>
    request(`/api/tenants/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // Painel do dono (/superadmin)
  listTenants: () => superadminRequest(`/api/tenants/`),
  createTenant: (data) =>
    superadminRequest(`/api/tenants/`, { method: "POST", body: JSON.stringify(data) }),
  resetTenantPassword: (tenantId, senha) =>
    superadminRequest(`/api/tenants/${tenantId}/redefinir-senha`, {
      method: "PATCH",
      body: JSON.stringify({ senha }),
    }),

  // Clientes
  listCustomers: (tenantId) => request(`/api/customers/tenant/${tenantId}`),
  getCustomer: (id) => request(`/api/customers/${id}`),
  createCustomer: (data) =>
    request(`/api/customers/`, { method: "POST", body: JSON.stringify(data) }),
  listCustomerEquipment: (customerId) =>
    request(`/api/customers/${customerId}/equipamentos`),

  // Equipamentos
  createEquipment: (data) =>
    request(`/api/equipment/`, { method: "POST", body: JSON.stringify(data) }),
  getEquipment: (id) => request(`/api/equipment/${id}`),

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

  // Acompanhamento público (sem login)
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
