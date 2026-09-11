import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Overview from "./pages/Overview.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Track from "./pages/Track.jsx";
import Customers from "./pages/Customers.jsx";
import Financeiro from "./pages/Financeiro.jsx";
import Estoque from "./pages/Estoque.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import SuperAdmin from "./pages/SuperAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/superadmin" element={<SuperAdmin />} />
      <Route path="/painel/:tenantId" element={<Dashboard />} />
      <Route path="/painel/:tenantId/visao-geral" element={<Overview />} />
      <Route path="/painel/:tenantId/clientes" element={<Customers />} />
      <Route path="/painel/:tenantId/nova" element={<NewOrder />} />
      <Route path="/painel/:tenantId/os/:orderId" element={<OrderDetail />} />
      <Route path="/painel/:tenantId/financeiro" element={<Financeiro />} />
      <Route path="/painel/:tenantId/estoque" element={<Estoque />} />
      <Route path="/painel/:tenantId/configuracoes" element={<Configuracoes />} />
      <Route
        path="/painel/:tenantId/relatorios"
        element={
          <Placeholder
            active="relatorios"
            title="Relatórios"
            description="Histórico detalhado e exportação de relatórios de atendimento."
          />
        }
      />
      <Route path="/acompanhar/:token" element={<Track />} />
      <Route path="*" element={<Navigate to="/superadmin" replace />} />
    </Routes>
  );
}
