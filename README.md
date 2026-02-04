# Pet e Tutores - Front-End

## Visão Geral do Projeto

Aplicação Front-End desenvolvida em **React + TypeScript**

A aplicação consome uma API pública de Pets e Tutores, implementando fluxos completos de autenticação, listagem, detalhamento, criação, edição e gerenciamento de vínculos, com foco em clareza arquitetural, previsibilidade de estado e manutenibilidade.

Trata-se de uma Single Page Application (SPA), com navegação client-side, rotas protegidas e suporte a refresh direto em URLs internas.

---

## Dados da Inscrição

- Nome: Fabricio Pinheiro Monteiro de Souza
- E-mail: fabricio.cientistati@hotmail.com
- Vaga: Analista de Tecnologia da Informação - Perfil Engenheiro da Computação (Sênior)
- Inscrição: 16423

## API Pública

- Base URL: `https://pet-manager-api.geia.vip` (endpoints em `/v1`)
- Swagger: `https://pet-manager-api.geia.vip/q/swagger-ui/`

## Credenciais de Acesso

- Usuário: admin
- Senha: admin

Observação: use as credenciais fornecidas pelo edital/ambiente de testes.

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM 7
- RxJS (BehaviorSubject)

## Pré-requisitos

- Node.js (LTS recomendado) e npm
- Docker (opcional, para build/execução em container)

## Variáveis de Ambiente

- Não há variáveis obrigatórias. A base da API está definida em `src/infraestrutura/http/clienteHttp.ts`.

---

## Execução Local

```bash
npm install
npm run dev
```

Observação: `npm install` também instala as dependências de testes (devDependencies).

## Build e Preview

```bash
npm run build
npm run preview
```

## Testes

Os testes usam Vitest + Testing Library (ambiente `jsdom`).

### Cobertura de Testes
- Componentes: `CardListagem`, `ListaTutores`, `ListaPets`
- Serviços: `PetsServico.listar`, `TutoresServico.listar`

```bash
npm run test
```

Para rodar em modo CI:

```bash
npm run test:run
```

## Dados de Teste

- CPF: deve ser válido (11 dígitos com validação).
- Telefone: 10 ou 11 dígitos com DDD (apenas números).
- Use dados fictícios válidos para passar nas validações.

## SPA (Single Page Application)

Esta aplicação é uma **SPA em React + TypeScript**: a navegação é client-side via **React Router**, sem recarregar a página.

Em produção, para o **refresh (F5)** e o acesso direto a rotas (ex.: `/pets/123`) funcionarem, o servidor precisa aplicar o fallback para `index.html`.
Este repositório inclui uma configuração de **Nginx** com `try_files ... /index.html` no arquivo `nginx.conf`.

## Executar via Docker (produção)

```bash
docker build -t frontend-pets-tutores .
docker run --rm -p 8080:80 frontend-pets-tutores
```

Abra no navegador: `http://localhost:8080`

## Health Checks (Liveness/Readiness)

Disponíveis no container Nginx:
- Liveness: `GET /healthz` ou `GET /saude` → `200 ok`
- Readiness: `GET /readyz` ou `GET /pronto` → `200 ready`

## Arquitetura da Aplicação
A aplicação utiliza um arquitetura em camadas para separar responsabilidades:

src/
    - `aplicacao/`: Páginas, componentes, rotas e facades (UI)
    - `dominio/`: Modelos e contratos de negócio
    - `infraestrutura/`: Serviços HTTP, autenticação e integrações
    - `estado/`: Gerenciamento de estado com BehaviorSubject

Essa organização:
- reduz acoplamento entre UI e infraestrutura
- facilita manutenção e evolução
- melhora previsibilidade do fluxo de dados
- evita lógica de negócio espalhada em componentes
- mantém a UI reativa e simples

A navegação é organizada em rotas públicas e privadas, com carregamento sob demanda via React.lazy.

## Arquitetura SPA e Navegação

- Navegação client-side sem reload
- Rotas privadas protegidas por autenticação
- Redirecionamento automático para login em caso de sessão inválida
- Retorno para a rota originalmente acessada após login
- Suporte a refresh direto em URLs internas

## Gerenciamento de Estado

Cada módulo (Pets e Tutores) possui um estado reativo centralizado, baseado em BehaviorSubject, mantendo:
- lista paginada
- item selecionado
- flags de carregamento e criação
- mensagens de erro
- dados auxiliares (ex.: vínculos entre entidades)

A atualização do estado é imutável e centralizada, e a UI apenas reage às mudanças, sem manipular dados diretamente.

## Facade Pattern

A aplicação utiliza o Facade Pattern para desacoplar a UI da infraestrutura.

As facades:
- orquestram chamadas aos serviços HTTP
- atualizam o estado reativo
- expõem apenas intenções para a UI

Os componentes não conhecem serviços, endpoints ou regras de negócio, garantindo baixo acoplamento e maior previsibilidade.

## Autenticação e Segurança

A aplicação utiliza autenticação JWT com refresh token automático.

Fluxo:
- access_token armazenado no localStorage
- Em erro 401:
  - chamada ao endpoint /autenticacao/refresh
  - atualização dos tokens
  - reenvio automático da requisição original
- Em falha de refresh:
  - limpeza da sessão
  - redirecionamento para /login (sem reload)

O fluxo é transparente para o usuário e garante persistência da sessão em uma SPA.

Quando o token expira, o refresh é feito em background sem exibir erro na UI. Em falha de refresh, o usuário é redirecionado para `/login` com mensagem de sessão expirada.

Após um refresh bem-sucedido, as telas de listagem, detalhe e edição refazem automaticamente a carga de dados com base na versão do token, garantindo que a UI não fique "travada" por falta de nova ação do usuário.

## Fluxos Implementados

    Pets
    - Listagem paginada (10 itens por página)
    - Busca por nome
    - Detalhamento completo
    - Criação e edição
    - Upload, atualização e remoção de imagem
    - Visualização de tutores vinculados

    Tutores
    - Listagem paginada
    - Busca por nome com debounce
    - Detalhamento completo (leitura)
    - Criação e edição
    - Upload e remoção de foto
    - Vinculação e desvinculação de pets
    - Remoção de tutor

    O carregamento das páginas é feito sob demanda com React.lazy.

## Requisitos do Edital (Resumo)

- SPA com React + TypeScript e rotas lazy-loaded por módulo (Pets/Tutores).
- Consumo de API em tempo real via Axios.
- Layout responsivo com Tailwind.
- Paginação (10 itens por página) e busca por nome.
- Autenticação com refresh token e rotas protegidas.
- Padrão Facade e estado reativo com BehaviorSubject.
- Testes unitários básicos de componentes e serviços.
- Health checks (liveness/readiness) via Nginx.

## Matriz de Avaliação (Checklist)

A. Estrutura e Organização
- Modularização: camadas `aplicacao`, `dominio`, `infraestrutura`, `estado`.
- Responsividade e UX: layout responsivo com Tailwind, grids e flex adaptáveis.
- Documentação: instruções de execução, testes, arquitetura, Docker e health checks.

B. Funcionalidades
- CRUD Pets/Tutores: GET/POST/PUT/DELETE e upload de fotos.
- Paginação e busca: paginação (10 itens) e filtro por nome.
- Autenticação JWT: login e refresh com interceptador.
- Upload de imagens: pets e tutores.
- Lazy Loading: rotas dinâmicas por módulo.
- State Management (Sênior): BehaviorSubject + Facade.
- Testes unitários: componentes e serviços básicos.

C. Boas Práticas e Entrega
- Clean Code: componentes reutilizáveis e responsabilidades claras.
- Commits e versionamento: histórico incremental será avaliado no `git log`.
- Performance: lazy loading, debounce e carregamento contextual.
- Documentação técnica: arquitetura e decisões registradas no README.
- Containerização/Deploy: Docker + Nginx com health checks.

## Decisões Técnicas e Justificativas

- Vite: build rápido e DX simples para SPA.
- Tailwind CSS: consistência visual e velocidade na composição de UI.
- React Router com lazy loading: melhora performance e atende ao requisito de rotas dinâmicas.
- Axios + interceptadores: centraliza autenticação e refresh de token.
- Facade + BehaviorSubject: desacopla UI da infraestrutura e mantém estado reativo previsível.
- Debounce nas buscas: reduz chamadas e melhora UX.
- Nginx com fallback SPA: permite refresh direto em rotas internas.
- Health checks no Nginx: atende liveness/readiness do edital.
- Vitest + Testing Library: testes rápidos e focados em comportamento de UI.

## Notas e Pendências

- O campo espécie não está disponível na API atual; na UI o rótulo "Espécie" usa o valor de `raça` para atender ao edital.

## Listagens (Pets e Tutores)

Os fluxos de listagem seguem o mesmo padrão arquitetural:
- Página responsável pela orquestração
- Facade responsável por busca, paginação e carregamento
- Componentes de lista focados apenas em UI
- Hooks reutilizáveis para paginação e busca

Esse desenho garante consistência, reutilização e facilidade de manutenção.

## Ajustes Recentes (Busca e Paginação)

- Testes unitários básicos para componentes e serviços.
- Busca com debounce e carregamento contextual 
- Facades centralizam busca/paginação para evitar chamadas duplicadas.
- Modais de vínculo seguem o mesmo padrão de busca e paginação.
- Aviso de carregamento da lista não desloca os cards.
- Listagem de tutores mostra nome com telefone mascarado.
- Detalhe de tutores vinculados exibe nome e telefone mascarado.
- Modal de vincular tutor exibe nome e telefone mascarado.
- Cards de listagem padronizados e com key estável nos mapas.
- Padronização de nomenclatura de componentes (ex.: ListaTutores) e alinhamento entre Pets/Tutores.
- Componente comum de card para listagens e modal de confirmação reutilizável.
- Normalização de mensagens e acentuação em textos de UI.
- Upload de foto com label neutro.
- Paleta de cores padronizada a partir do sidebar, com botões alinhados por ação.
- Máscaras e validações reutilizáveis para telefone/CPF/email.
- Máscaras aplicadas também no detalhamento de tutor.
- Validação para evitar cadastro de tutor com CPF já existente.
- Validação de CPF duplicado também na edição (aviso sem ocultar o formulário).
- Cadastro de tutor e pet permite pré-vincular itens via modal (antes de salvar).
- Listas de pré-vínculo exibem imagem, nome e detalhes básicos.
- Remoção de foto em edição sincroniza listagem e detalhe (pets e tutores).
- Troca/remoção de foto atualiza preview e evita reaparecer imagem anterior.
- Logout e sessão expirada tratados pelo estado de autenticação (sem eventos globais).
- Falha no login limpa tokens antigos para evitar refresh indevido.
- Logout limpa estados de Pets/Tutores para evitar dados residuais.
- Logout manual não preserva rota; sessão expirada mantém retorno para a rota anterior.


Telas de Detalhe (Pets e Tutores)

As telas de detalhe seguem separação clara de responsabilidades:

Página de detalhe
- carrega dados via Facade
- controla estado de carregamento
- orquestra navegação

Componente de detalhe
- apenas renderiza os dados
- não executa mutações de estado

As telas de leitura não executam ações de escrita, reduzindo complexidade e efeitos colaterais.

## Formulários de Criação e Edição

Os formulários de Pets e Tutores seguem um padrão único:
- Um único formulário reutilizado para criação e edição
- Validações básicas nos campos
- Preview de imagem antes do envio
- UI desacoplada de rotas e serviços

A página controla o fluxo e a navegação, enquanto o formulário é responsável apenas pela UI.

## Gerenciamento de Vínculos (Pets e Tutores)

O gerenciamento de vínculos ocorre diretamente nas telas de detalhe:
- Ações contextuais
- Confirmação via modal
- Atualização reativa do estado
- Sem recarregamento de página

## Camada HTTP e Serviços

- Cliente HTTP centralizado com Axios
- Interceptadores para autenticação e refresh token
- Serviços separados por entidade
- Nenhuma lógica de UI nos serviços

Os serviços possuem responsabilidade única e seguem o schema oficial da API pública.

## Modelos de Domínio

Os modelos de domínio refletem estritamente o schema oficial da API, garantindo:
- tipagem forte
- consistência
- clareza
- baixo acoplamento entre módulos

## Considerações Finais

O projeto prioriza:
- aderência aos requisitos do edital
- organização arquitetural clara
- previsibilidade de estado
- navegação SPA completa
- código limpo e manutenível

O desenho adotado permite evolução futura sem necessidade de refatorações estruturais.
