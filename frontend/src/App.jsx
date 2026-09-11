import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Overview from "./pages/Overview.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Track from "./pages/Track.jsx";
import Customers from "./pages/Customers.jsx";
import Placeholder from "./pages/Placeholder.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/painel/:tenantId" element={<Dashboard />} />
      <Route path="/painel/:tenantId/visao-geral" element={<Overview />} />
      <Route path="/painel/:tenantId/clientes" element={<Customers />} />
      <Route path="/painel/:tenantId/nova" element={<NewOrder />} />
      <Route path="/painel/:tenantId/os/:orderId" element={<OrderDetail />} />
      <Route
        path="/painel/:tenantId/financeiro"
        element={
          <Placeholder
            active="financeiro"
            title="Financeiro"
            description="Controle de pagamentos, garantias e faturamento do prestador."
          />
        }
      />
      <Route
        path="/painel/:tenantId/estoque"
        element={
          <Placeholder
            active="estoque"
            title="Estoque"
            description="Peças e componentes usados nos reparos."
          />
        }
      />
      <Route
        path="/painel/:tenantId/relatorios"
        element={
          <Placeholder
            active="relatorios"
            title="Relatórios"
            description="Relatório mensal de faturamento e histórico de atendimentos."
          />
        }
      />
      <Route
        path="/painel/:tenantId/configuracoes"
        element={
          <Placeholder
            active="config"
            title="Configurações"
            description="Dados da oficina, subdomínio e preferências do sistema."
          />
        }
      />
      <Route path="/acompanhar/:token" element={<Track />} />
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
