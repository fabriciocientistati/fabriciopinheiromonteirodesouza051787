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

    ### Pets
    - Listagem paginada (10 itens por página)
    - Busca por nome
    - Detalhamento completo
    - Criação e edição
    - Upload, atualização e remoção de imagem
    - Visualização de tutores vinculados

    ### Tutores
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


















    ### Fluxos de Listagem (Pets e Tutores)

    Os fluxos de listagem de Pets e Tutores seguem exatamente o mesmo padrão arquitetural,
    garantindo consistência, previsibilidade e fácil manutenção.

    Cada fluxo é dividido em três responsabilidades claras:

    - Orquestra o fluxo da tela
    - Controla busca, paginação e navegação
    - Interage exclusivamente com a Facade

    - **Componente de Listas**
    - Responsável apenas pela renderização da UI
    - Recebe dados e callbacks via props
    - Não conhece Facade nem estado global

    - **Hook reutilizáveis**
    - Centraliza lógica comum de paginação
    - Evita duplicação entre Pets e Tutores
    - Facilita testes e evolução futura

    Esse desenho garante:
    - baixo acoplamento
    - alta reutilização
    - facilidade de testes unitários




## Formulários de Criação e Edição (Pets e Tutores)

Os fluxos de criação e edição de Pets e Tutores seguem o mesmo padrão arquitetural,
garantindo consistência visual, previsibilidade de comportamento e fácil manutenção.

Cada funcionalidade é composta por:

- **Página**
  - Orquestra o fluxo de criação e edição
  - Resolve modo criação vs edição a partir da rota
  - Interage exclusivamente com a Facade
  - Controla navegação e mensagens de sucesso

- **Formulário**
  - Responsável apenas pela UI e validação
  - Utiliza componentes reutilizáveis de interface
  - Não conhece rotas, Facades ou estado global

O mesmo componente de formulário é reutilizado tanto no modo de criação quanto
no modo de edição, mudando apenas os dados iniciais recebidos via props.

Esse padrão reduz duplicação de código, melhora a testabilidade e mantém
alinhamento com o uso de Facade + BehaviorSubject.


## Decisões Técnicas

    - Facade Pattern foi adotado para desacoplar a UI da lógica de negócio e da infraestrutura.

    - BehaviorSubject (RxJS) gerenciamento de estado previsível, evitando bibliotecas mais pesadas como Redux, já que o domínio é bem delimitado.

    - A UI não manipula dados diretamente: apenas dispara intenções e reage ao estado.

    - Schemas diferentes são utilizados para listagem e detalhamento, evitando tráfego desnecessário de dados.

    - Serviços HTTP possuem responsabilidade única, sem conhecimento de UI.

    ### Ajustes no fluxo de Tutores

    O fluxo de Tutores foi refinado com foco em clareza arquitetural.

    Principais ajustes realizados:

    - Refatoração da listagem de tutores, separando responsabilidades entre página (orquestração) e componente de renderização.
    - Correção e padronização dos estados de loading, erro e lista vazia.
    - Busca por nome ajustada para comportamento previsível (busca vazia retorna todos os tutores).
    - Paginação funcional e informativa, com controle de limites e indicação da página atual.
    - Extração do formulário de tutor para um componente reutilizável, utilizado tanto para criação quanto edição.
    - Implementação de validações básicas no formulário para garantir integridade dos dados.
    - Ajuste do componente de upload de foto, mantendo responsabilidade única (seleção e pré-visualização), sem acoplamento com API.
    - Pequenos refinamentos visuais utilizando TailwindCSS, priorizando legibilidade e UX sem foco em design visual.

    As decisões priorizaram código limpo, fácil manutenção e aderência aos requisitos do edital, mantendo espaço para evolução futura do domínio.

    Correção no fluxo de edição de tutores: botão de editar direciona para a rota correta e o formulário carrega os dados do tutor para alteração, incluindo CPF e foto.

    ### Ajustes no fluxo de Login 

    O fluxo de autenticação foi refatorado para seguir o mesmo padrão arquitetural do restante da aplicação.

    Principais ajustes:
    - Desacoplamento entre página e formulário de login
    - Centralização da lógica de autenticação na Facade
    - Estado reativo responsável por loading, erro e autenticação
    - Correção do controle de carregamento para evitar estados travados
    - UI de login estilizada com TailwindCSS, mantendo consistência visual

    Esses ajustes garantem previsibilidade, baixo acoplamento e melhor experiência do usuário.

    ## Telas de Detalhe (Pets e Tutores)

    As telas de detalhe de Pets e Tutores seguem o mesmo padrão arquitetural,
    separando responsabilidades entre página e componentes de UI.

    Cada fluxo é composto por:

    - **Página de Detalhe**
    - Responsável por carregar os dados via Facade
    - Controla estado de carregamento
    - Orquestra navegação da tela

    - **Componente de Detalhe**
    - Exibe as informações principais da entidade
    - Não contém lógica de carregamento ou navegação

    Esse padrão garante:
    - reutilização de layout
    - clareza na leitura do código
    - fácil manutenção
    - visualização explícita das relações do domínio

    ## Gerenciamento de Vínculos entre Pets e Tutores

    O sistema permite o gerenciamento completo dos vínculos entre Pets e Tutores
    diretamente nas telas de detalhe, garantindo clareza e segurança na operação.

    ### Desvinculação de Tutores de um Pet e Tutor

    A desvinculação de um tutor é realizada na tela de **Detalhe do Pet**, no mesmo
    local onde os tutores vinculados são exibidos.

    A desvinculação de um pet é realizada na tela de **Detalhe do tutor**, no mesmo
    local onde os pets vinculados são exibidos.

    Características do fluxo:

    - Ação disponível diretamente no card do tutor vinculado
    - Confirmação obrigatória via modal
    - Operação contextual, reduzindo risco de desvinculação incorreta
    - Atualização do estado centralizado via Facade

    Essa abordagem mantém o controle de vínculos próximo ao contexto onde eles são
    visualizados, seguindo boas práticas de UX e arquitetura.

    ### Ajustes de Layout e Rotas Privadas

    O layout da aplicação foi desacoplado entre áreas públicas e privadas.

    Principais ajustes:
    - Separação entre layout público (login) e layout autenticado
    - Rotas privadas agrupadas sob uma única proteção de autenticação
    - Remoção de elementos autenticados da tela de login 
    - UI refinada com TailwindCSS para melhor legibilidade e experiência do usuário

    Esses ajustes reduzem acoplamento, melhoram manutenção e garantem consistência visual, alinhando a aplicação aos requisitos do edital.

    ### Ajustes de Layout, Navegação e UX

    A interface da aplicação foi refinada para melhorar a experiência do usuário e alinhar o fluxo de navegação ao domínio do sistema.

    Principais ajustes:
    - Implementação de um sidebar fixo no layout autenticado
    - Separação clara entre layout público (login) e layout privado
    - Definição da lista de tutores como rota principal pós-login
    - Agrupamento das rotas privadas sob uma única proteção
    - Refinamento visual com TailwindCSS para maior legibilidade e clareza

    Esses ajustes garantem navegação previsível, baixo acoplamento entre UI e regras de negócio e aderência aos requisitos do edital.


## Gerenciamento de Estado (Pets e Tutores)

Cada módulo possui um estado reativo baseado em BehaviorSubject, mantendo:
    - Lista paginada
    - Item selecionado
    - Flags de carregamento e criação
    - Mensagens de erro
    - Dados auxiliares (ex.: pets vinculados ao tutor)

A atualização do estado é imutável e centralizada, garantindo previsibilidade e facilidade de testes.

## Facade Pattern

Chamam serviços HTTP, atualizam o estado reativo, mantêm a UI simples e previsível.

A aplicação utiliza o padrão Facade para desacoplar a camada de apresentação da infraestrutura. Os componentes interagem apenas com facades, que orquestram os serviços HTTP e atualizam o estado reativo via BehaviorSubject. Isso garante baixo acoplamento.

## Módulo de Tutores

Funcionalidades
    - Listagem paginada de tutores
    - Detalhamento completo
    - Criação e edição
    - Upload e remoção de foto
    - Vinculação e desvinculação de pets
    - Remoção de tutor

### Busca de Pets Padronizada

A busca de pets foi atualizada para seguir o mesmo padrão da listagem de tutores:

- Debounce
- Campo de busca com debounce
- Filtro reativo via estado
- Paginação integrada
- Comportamento consistente entre páginas e modais
- UX responsiva

A modal de vinculação de pets agora permite buscar por nome com resposta imediata e visualização paginada.

### Padronização do Formulário de Tutor

O formulário de criação e edição de tutores foi totalmente estilizado para seguir o padrão visual da aplicação:

- Preview da foto do tutor com opção de remoção
- Feedback visual de validação diretamente nos campos
- Botões padronizados com variantes (`sucesso`, `secundario`, `perigo`)
- Layout responsivo e consistente com o restante do sistema

Essa atualização melhora a experiência do usuário e mantém a identidade visual uniforme em toda a aplicação.

## Listagem de Tutores

Exibe tutores em formato de cards, com paginação e acesso à criação de novos registros.
A página consome exclusivamente a TutoresFacade.

### Detalhamento de Tutores e Pets Vinculados

### Detalhamento de Tutores (Leitura)

A tela de detalhamento do tutor foi refatorada para atuar exclusivamente como **visualização de dados**, sem executar ações de mutação de estado.

Ela exibe:
- Informações completas do tutor (foto, email, telefone, endereço e CPF)
- Lista de pets vinculados com foto, nome, raça e idade

Essa separação garante que telas de leitura não executem ações de escrita, reduzindo acoplamento, efeitos colaterais e complexidade na UI.

#### Comportamento UX definido:

- O estado global (`filtroBusca`) é atualizado via `definirBusca()`
- A função `carregarPagina()` é chamada com o termo de busca
- O serviço envia o parâmetro `nome` para a API conforme especificação Swagger
- A lista de tutores é atualizada reativamente com os resultados filtrados

#### Detalhes técnicos:

- O estado `TutoresViewEstado` agora inclui `filtroBusca: string`
- O facade `TutoresFacade` possui `definirBusca(busca: string)`
- O serviço `TutoresServico.listar()` envia `nopme` como query param
- O componente `ListaTutoresPagina` escuta `estado.filtroBusca` e `estado.pagina` para disparar atualizações

Esse fluxo garante uma experiência fluida, moderna e alinhada ao padrão UX definido para o projeto.


## Detalhamento do Tutor

Exibe dados completos do tutor e a lista de pets vinculados, permitindo remoção de vínculo e navegação para edição.

# Cadastro e Edição de Tutor

A página de formulário permite criar ou editar tutores, com campos obrigatórios e upload de foto.
Integra diretamente com a Facade (TutoresFacade) e atualiza o estado reativo.
Após salvar, redireciona para a página de detalhes do tutor.

## Módulo de Pets

Listagem com Paginação:
    - Paginação de 10 itens por página
    - Fluxo:
        1. UI solicita página
        2. Facade chama serviço
        3. Estado é atualizado
        4. UI reage ao estado

## Serviço de Tutores

O módulo de Tutores possui um serviço dedicado (TutoresServico) responsável por toda comunicação com a API pública.
Ele implementa:
    - Listagem paginada de tutores
    - Busca por ID
    - Criação e atualização
    - Upload de foto
    - Listagem de pets vinculados
    - Vinculação e remoção de vínculo
    - Remover tutor
    - Remover foto

O serviço segue o padrão de responsabilidade única, sem lógica de UI, garantindo clareza e facilidade de manutenção.

## Gerenciamento de Estado com BehaviorSubject

O estado da aplicação é gerenciado com BehaviorSubject, conforme exigido no edital.
Cada entidade (Pets, Tutores) possui um estado centralizado.

itens, carregamento, erros, paginação, item selecionado, a UI apenas assina o estado e dispara itenções, sem manupular dados diretamente.

## Listagem de Pets com Paginação

A listagem utiliza paginação com 10 itens por página, conforme edital.

Fluxo da paginação:
A UI solicita uma página à Face
A Facade chama o serviço e atualiza o estado
O estado mantém:
    - itens
    - página atual
    - total de registros
    - tamanho da página
    - total de página
    
A UI exibe e navega entre páginas sem lógica de domínio.

A API recebe os parâmetros de página e tamanho
A Facade orquestra a chamada e atualiza o estado reativo
O estado centralizado mantém a página atual e o total de registros
A interface calcula o total de páginas e controla a navegação.

## Detalhamento Completo do Pet

A tela de detalhamento utiliza o schema completo retornado pelo endpoint `/pets/{id}`,
exibindo todas as informações do pet, incluindo:
    - Nome
    - Raça
    - Idade
    - Foto
    - Tutores associados (com foto)

A imagem é exibida diretamente pela URL fornecida pela API.

## Criação e Atualização de Pets

    1. POST /v1/pets
    2. Upload opcional da imagem (POST /v1/pets/{id}/foto)
    3. Redirecionamento automático para detalhes

    Atualização:
        - Atualização de dados
        - Upload de nova imagem
        - Remoção da foto existente
    Toda a lógica é orquestrada pela Facade.

## Criação de Pets com Upload de Imagem

A tela de criação de pets permite cadastrar um novo pet enviando:
    - Nome
    - Raça
    - Idade
    - Imagem (opcional)

O fluxo segue o padrão definido pelo backend:

    1. O pet é criado via `POST /v1/pets`
    2. Caso uma imagem seja selecionada, ela é enviada em seguida via  
    `POST /v1/pets/{id}/foto` utilizando `multipart/form-data`
    3. O usuário é redirecionado automaticamente para a tela de detalhes do pet

A UI oferece:
    - validação de campos obrigatórios
    - preview da imagem antes do envio
    - feedback de erro
    - UI desacoplada
    - botão para retornar à lista de pets

Esse fluxo mantém a responsabilidade única de cada endpoint e mantendo previsibilidade ao usuário

## Atualização de Pets (com imagem e remoção de foto)

A aplicação permite atualizar os dados de um pet, incluindo:
    - nome  
    - raça  
    - idade  
    - imagem (opcional)

Durante a edição, o usuário pode:
    - enviar uma nova imagem  
    - visualizar a imagem atual  
    - remover a foto existente  

A UI apenas exibe e dispara intenções, enquanto a Facade orquestra toda a lógica de negócio.  
As rotas foram atualizadas para incluir `/pets/:id/editar` com carregamento dinâmico (lazy loading).

## Componentes Auxiliares

O módulo de Tutores possui componentes reutilizáveis:
    - ListaPetsVinculados: lista pets associados ao tutor, com botão de remoção.
    - VincularPetModal: modal para selecionar um pet e vinculá-lo ao tutor, com paginação e integração com a Facade.

Esses componentes mantêm a UI organizada, reutilizável e alinhada ao padrão do módulo de Pets.

Atualizações no VincularPetModal:
    - O modal recebeu melhorias importantes:
    - Layout responsivo com flex-col no mobile e flex-row no desktop
    - Botões adaptados para toque em telas pequenas
    - Cards reorganizados para melhor leitura
    - Busca reativa integrada ao estado global

Essas melhorias tornam o fluxo de vinculação mais rápido, intuitivo e consistente com o restante da aplicação.

## Rotas e Lazy Loading

As rotas de Pets e Tutores utilizam Lazy Loading com `React.lazy` e `Suspense`, rotas públicas e privadas, controle de acesso via autenticação,
isso permite carregamento sob demanda e melhor performance inicial dos componentes.

## Modelos de Domínio

Os modelos de domínio representam as entidades principais do sistema Pet, tutor e Foto, Refletido pela API.

Eles ficam isolados da camada da UI, facilitando tipagem forte, manutenção, testes e clareza.

## Camada HTTP e Serviços

    - Cliente HTTP centralizado com Axios
    - Interceptadores para autenticação e refresh token
    - Serviços separados por entidade
    - Nenhuma lógica de UI nos serviços

A comunicação com a API é centralizada em uma camada de serviços, utilizando Axios configurado em um cliente HTTP único.

Cada serviço é responsável apenas por consumir endpoints específicos, mantendo a camada da UI desacoplada da infraestrutura.

Serviço separados por entidade, paginação implementada no backend e consumida pela Facade.

O controle de navegação entre páginas é realizado na camada de apresentação UI, com dados fornecidos pela Facade.

## Modelos de Domínio

Os modelos seguem estritamente o schema oficial da API pública, garantindo:
    - Tipagem forte
    - Consistência
    - Clareza
    - Baixo acoplamento entre módulos

## Autenticação e Segurança

Os contratos de autenticação (credenciais e tokens) são definidos na
camada de domínio, evitando tipagens soltas na infraestrutura.

A aplicação utiliza autenticação JWT, com login e renovação automática do token de acesso via refresh token.

O interceptador HTTP é responsável por injetar o token nas requisições e renovar a autenticação de forma transparente ao usuário.

A aplicação utiliza:
    - Autenticação JWT
    - Refresh Token automático
    - Interceptador que injeta nas requisições
    - Renovação transparente ao usuário

Fluxo de Refresh Token
    - access_token armazenado no localStorage
    - Em erro 401:
        - Chamada a /autenticacao/refresh
        - Atualização dos tokens
        - Reenvio automático da requisição original
    - Em falha: redirecionamento para /login

Os contratos de autenticação ficam na camada de domínio, garantindo consistência tipada.

## Autenticação com Refresh Token

Possui autenticação JWT com suporte a refresh automático de token.
    - O `access_token` é armazenado no `localStorage`.
    - Quando o token expira, o interceptador detecta o erro 401 e chama `/autenticacao/refresh`.
    - O `refresh_token` é enviado via header Authorization (Bearer).
    - Se a API retornar um novo token, o interceptador:
        - Salva os novos tokens
        - Atualiza o estado reativo
        - Reenvia a requisição original automaticamente
    - Se o refresh falhar, o usuário é redirecionado para `/login`.

    O fluxo é transparente para o usuário e garante persistência da sessão sem recarregar a página.
