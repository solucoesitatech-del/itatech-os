# iTATech OS — Sistema de Ordem de Serviço

Backend inicial (FastAPI + MongoDB) para o sistema de ordem de serviço, no mesmo
padrão do iTATech Delivery: multi-tenant, cada oficina/prestador com seu
subdomínio.

## Estrutura

```
backend/
  main.py              # registra as rotas e sobe o app FastAPI
  database.py           # conexão Mongo (database "itatech_os", mesmo cluster do delivery)
  models/
    schemas.py           # Tenant, Customer, Equipment, ServiceOrder, Payment...
  routers/
    tenants.py            # cadastro de oficinas/prestadores
    customers.py           # clientes + equipamentos
    service_orders.py       # OS: criação, status, orçamento, link público de acompanhamento
    payments.py              # pagamentos e relatório mensal de faturamento
```

## Como rodar localmente

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edite com sua MONGO_URL
uvicorn main:app --reload
```

## Endpoints principais

- `POST /api/tenants/` — cadastra uma oficina/prestador
- `POST /api/customers/` — cadastra um cliente
- `POST /api/equipment/` — cadastra um equipamento do cliente
- `POST /api/service-orders/` — abre uma nova OS (gera número sequencial + token público)
- `PATCH /api/service-orders/{id}/status` — atualiza status (grava histórico automaticamente)
- `POST /api/service-orders/{id}/orcamento` — define itens e valor do orçamento
- `GET /api/acompanhar/{token_publico}` — **rota pública**, sem login: é o link que o
  cliente recebe pelo WhatsApp pra acompanhar a OS
- `POST /api/acompanhar/{token}/aprovar-orcamento` — cliente aprova o orçamento pelo link
- `POST /api/acompanhar/{token}/assinar` — cliente assina digitalmente
- `GET /api/payments/tenant/{tenant_id}/relatorio-mensal?ano=2026&mes=9` — faturamento do mês

## Frontend

React + Vite, sem framework de estilo — CSS próprio com identidade de "ficha de
ordem de serviço" (tickets, carimbo de status, linha do tempo de acompanhamento).

```
frontend/
  src/
    api.js              # chamadas para o backend (VITE_API_URL)
    styles.css            # tokens de cor/tipografia e estilos dos tickets
    App.jsx                 # rotas
    pages/
      Dashboard.jsx          # /painel/:tenantId — lista de OS do prestador
      NewOrder.jsx             # /painel/:tenantId/nova — abrir nova OS
      OrderDetail.jsx           # /painel/:tenantId/os/:orderId — status + orçamento
      Track.jsx                  # /acompanhar/:token — página pública (link do WhatsApp)
```

### Rodar localmente

```bash
cd frontend
npm install
cp .env.example .env   # aponte VITE_API_URL pro backend
npm run dev
```

### Identidade visual

- Paleta de "ficha de oficina": papel bege (`#ece8dd`), tinta grafite (`#20241f`),
  carimbo em ferrugem (`#b5502b`) e status positivo em verde-cobre (`#3b6e64`)
- Tipografia dupla: IBM Plex Sans pro corpo, IBM Plex Mono pros números de OS e
  status — reforça a sensação de ficha/formulário técnico
- A página `/acompanhar/:token` é a única pensada para o cliente final: linha do
  tempo com checkpoints reais (recebido → entregue), sem exigir login

## Próximos passos sugeridos

1. Testar os endpoints localmente com o Mongo Atlas (mesmo cluster do delivery, database `itatech_os`)
2. Montar o frontend em React reaproveitando os componentes visuais do iTATech Delivery
3. Implementar o disparo real de mensagens no WhatsApp (Z-API, WhatsApp Cloud API ou wa.me como primeira versão)
4. Página pública de acompanhamento (`/acompanhar/{token}`) — a peça-chave do diferencial do produto
