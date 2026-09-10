# Deploy — iTATech OS

Mesmo padrão do iTATech Delivery: backend no Render, frontend na Vercel, banco
no MongoDB Atlas (mesmo cluster, database separado).

## 1. Banco de dados

No mesmo cluster Atlas do delivery, não precisa criar cluster novo — o
`DB_NAME=itatech_os` já separa os dados automaticamente. Se preferir, crie um
usuário de banco específico para o itatech-os por segurança.

## 2. Backend (Render)

1. Suba a pasta `itatech-os` num repositório GitHub novo (ou pasta dentro do
   mesmo repo do delivery, como preferir).
2. No Render, "New Web Service" → conecte o repositório.
3. O `render.yaml` na raiz já configura: `rootDir: backend`, build e start
   command. Se o Render não detectar automaticamente, configure manualmente:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Variáveis de ambiente a preencher no painel do Render:
   - `MONGO_URL` — mesma connection string do Atlas usada no delivery
   - `DB_NAME` — `itatech_os`
   - `CORS_ORIGIN_REGEX` — por enquanto pode ser `.*`; depois que o domínio
     estiver definido, restrinja (ex: `https://.*\.itatechos\.com\.br`)
5. Anote a URL gerada (algo como `itatech-os-backend.onrender.com`) — vai ser o
   `VITE_API_URL` do frontend.

## 3. Frontend (Vercel)

1. "Add New Project" na Vercel → aponte pra pasta `frontend`.
2. Framework preset: Vite (a Vercel detecta sozinha pelo `package.json`).
3. Variável de ambiente: `VITE_API_URL` = URL do backend no Render (passo
   anterior).
4. O `vercel.json` já garante que qualquer rota (`/painel/...`,
   `/acompanhar/...`) caia no `index.html` e o React Router assuma — sem isso,
   recarregar a página numa rota interna dá 404.

## 4. Domínio

Sugestão de nome, seguindo o padrão do delivery: **itatechos.com.br**.

⚠️ Diferença importante em relação ao delivery: hoje o painel de cada
prestador é acessado por **caminho** (`itatechos.com.br/painel/{tenant_id}`),
não por **subdomínio** (`oficina.itatechos.com.br`) como no delivery. O campo
`subdominio` já existe no modelo `Tenant`, mas o roteamento por subdomínio
ainda não foi implementado no frontend — é um próximo passo, não algo quebrado.
Por enquanto, cada prestador recebe um link direto com seu `tenant_id`.

## 5. Checklist final

- [ ] Backend no Render respondendo em `/api/health`
- [ ] Frontend na Vercel carregando e falando com o backend (teste criar uma OS)
- [ ] Link de `/acompanhar/{token}` abrindo sem exigir login
- [ ] Domínio `itatechos.com.br` apontado (nameservers na Vercel, igual foi
      feito no delivery)
