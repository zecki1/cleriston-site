# Painel de Gestão de Conteúdo Multi-Site (CMS)

Uma solução centralizada construída com Next.js e Firebase para gerenciar dinamicamente o conteúdo de múltiplos sites de clientes a partir de um único painel de administração. Este projeto serve como o CMS para sites de clientes, como o `cleristonribeiro.com.br`.

## Visão Geral do Projeto

O objetivo deste sistema é permitir que um administrador edite todas as informações textuais e visuais de um site de cliente através de uma interface segura e intuitiva. As alterações salvas no painel são refletidas quase instantaneamente no site do cliente, graças à revalidação on-demand do Next.js, garantindo que o site do cliente permaneça extremamente rápido (estático) enquanto seu conteúdo é totalmente dinâmico.

## Arquitetura

O sistema é dividido em duas aplicações Next.js independentes que se comunicam através do Firebase:

1.  **Painel de Admin (`zecki1.com.br`)**
    *   **Função:** Interface de gerenciamento de conteúdo (CMS).
    *   **Autenticação:** O acesso é protegido pelo Firebase Authentication. Cada cliente (ex: Cleriston) é um usuário com email e senha.
    *   **Operações:** Realiza operações de Leitura e Escrita (CRUD) em um documento específico na coleção `clientes` do Firestore. O documento de cada cliente é identificado pelo seu UID do Firebase.
    *   **Uploads:** Gerencia o upload, preview e exclusão de imagens no Firebase Storage do **projeto principal** (`zecki-site`), organizando os arquivos em pastas com o UID do cliente para segurança.
    *   **Revalidação:** Após salvar os dados, o painel dispara uma requisição `fetch` para uma API no site do cliente, enviando um token secreto para autorizar a limpeza do cache de produção.

2.  **Site do Cliente (Ex: `cleristonribeiro.com.br`)**
    *   **Função:** Site público de alta performance.
    *   **Renderização:** Utiliza Geração de Site Estático (SSG) com Revalidação Incremental On-Demand (ISR) para garantir carregamento ultrarrápido e SEO otimizado.
    *   **Leitura de Dados:** Busca os dados para exibição diretamente do Firestore do projeto principal (`zecki-site`), usando um `CLIENT_ID` (o UID do cliente) definido nas variáveis de ambiente.
    *   **API de Revalidação:** Possui um *Route Handler* (`/api/revalidate`) que, ao ser chamado com o token secreto correto, executa o `revalidatePath('/')` do Next.js. Isso instrui a Vercel a gerar uma nova versão estática da página com os dados atualizados do Firestore.

3.  **Firebase (Backend Central do `zecki-site`)**
    *   **Firestore:** Atua como o banco de dados NoSQL, armazenando todo o conteúdo estruturado de todos os sites de clientes.
    *   **Storage:** Armazena todos os arquivos de mídia (imagens de perfil, portfólio, etc.) de todos os clientes, com regras de segurança que isolam o acesso de escrita por UID.
    *   **Authentication:** Gerencia a identidade dos clientes (usuários do painel) e protege o acesso.

## Stack de Tecnologias

-   **Framework:** Next.js 14+ (App Router)
-   **Backend & Database:** Firebase (Authentication, Firestore, Storage)
-   **UI & Estilização:** React, TypeScript, Tailwind CSS, Shadcn/ui, Radix UI
-   **Internacionalização (i18n):** `i18next` e `react-i18next` para suporte multi-idioma (PT, EN, ES).
-   **Animação:** Framer Motion
-   **Formulários:** React Hook Form (implícito no Shadcn/ui)
-   **Validação:** Zod (implícito no Shadcn/ui)
-   **Deployment:** Vercel

## Desafios Superados e Soluções Implementadas

Durante o desenvolvimento, enfrentamos e resolvemos vários desafios técnicos. Esta seção documenta "como" os problemas foram solucionados.

### 1. Erro de Build: Inconsistência de Tipos e `Unexpected any`
-   **Problema:** O `build` falhava constantemente devido a erros de tipagem do TypeScript e regras do ESLint como `@typescript-eslint/no-explicit-any`. Isso ocorria em funções que manipulavam objetos de estado aninhados dinamicamente.
-   **Solução:** Refatoramos as funções problemáticas, como `handleInputChange`, para usar tipos mais explícitos. Em vez de `let current: any`, usamos `let current: { [key: string]: any }` e criamos funções auxiliares (`setNestedValue`) para isolar a lógica de manipulação de objetos, tornando o código mais seguro e compatível com as regras de linting.

### 2. Alterações no Painel Não Refletiam no Site de Produção
-   **Problema:** Após salvar as alterações no painel, o site do cliente na Vercel continuava exibindo o conteúdo antigo devido ao cache estático (SSG).
-   **Solução:** Implementamos a Revalidação On-Demand do Next.js.
    1.  Criamos uma API Route (`/api/revalidate/route.ts`) no site do cliente, protegida por um token secreto.
    2.  Na função `handleSave` do painel, após o `updateDoc` no Firestore ser concluído com sucesso, adicionamos uma chamada `fetch` para essa API, forçando a Vercel a limpar o cache e gerar uma nova versão da página com os dados atualizados.

### 3. Erro de Rede: `Failed to fetch` (Bloqueio por CORS)
-   **Problema:** As requisições `fetch` da etapa anterior eram bloqueadas pelo navegador com um erro de CORS quando o painel rodava em `localhost` e tentava acessar a API em produção.
-   **Solução:** A API de revalidação no site do cliente foi aprimorada para incluir cabeçalhos de CORS (`Access-Control-Allow-Origin`). Criamos uma lista de origens permitidas (`allowedOrigins`) que inclui tanto `localhost:3000` (para desenvolvimento) quanto a URL de produção do painel, resolvendo o problema.

### 4. Imagens Quebradas no Componente `<Image>` (Erro 400)
-   **Problema:** O componente `<Image>` do Next.js não conseguia carregar ou otimizar as imagens vindas do Firebase Storage, resultando em erro 400 (Bad Request).
-   **Solução:** Para que o Next.js possa otimizar imagens de domínios externos, o hostname precisa ser autorizado. Adicionamos a configuração `images.remotePatterns` ao arquivo `next.config.mjs` de **ambos os projetos** para permitir o domínio `firebasestorage.googleapis.com`.

### 5. Erro de Hidratação com i18n
-   **Problema:** O site apresentava um erro de `Hydration Mismatch`, pois o servidor renderizava o texto no idioma padrão (ptBR), enquanto o cliente, ao detectar o idioma do navegador, tentava renderizar em outro idioma, causando uma inconsistência.
-   **Solução:** Implementamos o padrão `isMounted` em todos os componentes que usam o hook `useTranslation`. Os componentes agora renderizam o texto padrão (`ptBR`) na primeira passagem (no servidor) e, somente após a montagem no cliente (`useEffect`), eles se atualizam para o idioma detectado, garantindo que o HTML inicial seja idêntico em ambos os lados.

### 6. Erro de Variável de Ambiente na Vercel
-   **Problema:** O site em produção exibia "Erro de Configuração" porque não encontrava a variável `CLIENT_ID`.
-   **Solução:** O problema era uma inconsistência de nomes. O código esperava `process.env.CLIENT_ID`, mas na Vercel a variável estava cadastrada como `NEXT_PUBLIC_CLIENT_ID`. A solução foi padronizar, removendo o prefixo `NEXT_PUBLIC_` da variável na Vercel, já que ela é usada apenas no lado do servidor.

## Configuração do Ambiente

Para rodar os projetos localmente, você precisará de dois terminais.

### Projeto 1: Painel de Admin (`zecki1`)

1.  **Clone o repositório** e entre na pasta do projeto.
2.  **Instale as dependências:** `npm install`.
3.  **Configure `.env.local`:** Crie o arquivo e adicione as chaves.
    ```env
    # Firebase (do seu projeto principal 'zecki-site')
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    # ... (outras chaves do Firebase)

    # Revalidação
    NEXT_PUBLIC_CLIENT_SITE_URL="http://localhost:3001" # URL do site do cliente rodando localmente
    NEXT_PUBLIC_REVALIDATE_TOKEN="SEU_TOKEN_SECRETO_COMPARTILHADO"
    ```
4.  **Rode o servidor:** `npm run dev`. O painel estará disponível em `http://localhost:3000`.

### Projeto 2: Site do Cliente (`cleriston-site`)

1.  **Clone o repositório** e entre na pasta do projeto.
2.  **Instale as dependências:** `npm install`.
3.  **Configure `.env.local`:** Crie o arquivo e adicione as chaves.
    ```env
    # Firebase (do projeto principal 'zecki-site')
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    # ... (outras chaves do Firebase)

    # ID do Cliente (UID do usuário do cliente no seu Firebase Auth)
    CLIENT_ID="xxxxx"

    # Revalidação
    REVALIDATE_TOKEN="SEU_TOKEN_SECRETO_COMPARTILHADO" # Note a ausência de NEXT_PUBLIC_
    NEXT_PUBLIC_ADMIN_URL="http://localhost:3000"
    
    # EmailJS
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
    ```
4.  **Rode em uma porta diferente:**
    ```bash
    npm run dev -- -p 3001
    ```
    O site do cliente estará disponível em `http://localhost:3001`.