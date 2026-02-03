# Pet e Tutores – Front-End

## Visão Geral do Projeto

Aplicação Front-End desenvolvida em **React + TypeScript**

A aplicação consome uma API pública de Pets e Tutores, implementando fluxos completos de autenticação, listagem, detalhamento, criação, edição e gerenciamento de vínculos, com foco em clareza arquitetural, previsibilidade de estado e manutenibilidade.

Trata-se de uma Single Page Application (SPA), com navegação client-side, rotas protegidas e suporte a refresh direto em URLs internas.

---

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- RxJS (BehaviorSubject)

---

## Execução Local

```bash
npm install
npm run dev
```

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

## Listagens (Pets e Tutores)

Os fluxos de listagem seguem o mesmo padrão arquitetural:
- Página responsável pela orquestração
- Facade responsável por busca, paginação e carregamento
- Componentes de lista focados apenas em UI
- Hooks reutilizáveis para paginação e busca

Esse desenho garante consistência, reutilização e facilidade de manutenção.

## Ajustes Recentes (Busca e Paginação)

- Busca com debounce e carregamento contextual 
- Facades centralizam busca/paginação para evitar chamadas duplicadas.
- Modais de vínculo seguem o mesmo padrão de busca e paginação.
- Listagem de tutores mostra nome com telefone mascarado.
- Detalhe de tutores vinculados exibe nome e telefone mascarado.
- Cards de listagem padronizados e com key estável nos mapas.
- Padronização de nomenclatura de componentes (ex.: ListaTutores) e alinhamento entre Pets/Tutores.
- Componente comum de card para listagens e modal de confirmação reutilizável.
- Normalização de mensagens e acentuação em textos de UI.
- Máscaras e validações reutilizáveis para telefone/CPF/email.
- Máscaras aplicadas também no detalhamento de tutor.


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
