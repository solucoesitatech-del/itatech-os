import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function Placeholder({ active, title, description }) {
  const { tenantId } = useParams();

  return (
    <Layout tenantId={tenantId} active={active}>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p className="subtle">{description}</p>
        </div>
      </div>

      <div className="empty-state">
        Este módulo ainda está em desenvolvimento e chega em breve por aqui.
      </div>
    </Layout>
  );
}
