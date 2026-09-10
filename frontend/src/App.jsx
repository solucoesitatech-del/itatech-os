import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Track from "./pages/Track.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/painel/:tenantId" element={<Dashboard />} />
      <Route path="/painel/:tenantId/nova" element={<NewOrder />} />
      <Route path="/painel/:tenantId/os/:orderId" element={<OrderDetail />} />
      <Route path="/acompanhar/:token" element={<Track />} />
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
