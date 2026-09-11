import {
  IconOverview,
  IconOrders,
  IconClients,
  IconFinance,
  IconStock,
  IconReports,
  IconSettings,
} from "./icons.jsx";

export const NAV_ITEMS = [
  { key: "overview", label: "Visão geral", icon: IconOverview, path: (t) => `/painel/${t}/visao-geral` },
  { key: "orders", label: "Ordens de Serviço", icon: IconOrders, path: (t) => `/painel/${t}` },
  { key: "clients", label: "Clientes", icon: IconClients, path: (t) => `/painel/${t}/clientes` },
  { key: "financeiro", label: "Financeiro", icon: IconFinance, path: (t) => `/painel/${t}/financeiro` },
  { key: "estoque", label: "Estoque", icon: IconStock, path: (t) => `/painel/${t}/estoque` },
  { key: "relatorios", label: "Relatórios", icon: IconReports, path: (t) => `/painel/${t}/relatorios`, soon: true },
  { key: "config", label: "Configurações", icon: IconSettings, path: (t) => `/painel/${t}/configuracoes` },
];
