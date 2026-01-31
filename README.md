# Pet e Tutores – Front-End

## Visão Geral do Projeto

Aplicação Front-End desenvolvida em **React + TypeScript**

O projeto consome uma **API pública de Pets e Tutores**, aplicando boas práticas de arquitetura, separação de responsabilidades, previsibilidade de estado e organização de código, com foco em **manutenibilidade, escalabilidade e clareza técnica**.

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

## UI e Design System

O frontend utiliza **TailwindCSS** com um estilo visual **minimalista moderno (inspirado em Apple)**, priorizando clareza, legibilidade e foco no conteúdo.  
Para garantir consistência e reaproveitamento, foi criado um pequeno **design system** com componentes base reutilizáveis.

### Estilo visual

- Predominância de fundo branco e cinzas suaves  
- Bordas finas e discretas (`border-gray-200` / `border-gray-300`)  
- Sombras leves (`shadow-sm`, `shadow-md`)  
- Espaçamento generoso (`p-4`, `p-6`, `gap-4`, `space-y-4`)  
- Tipografia limpa com hierarquia clara (`text-2xl`, `text-lg`, `text-sm`)  

### Componentes base de UI

Os componentes abaixo são usados em todo o projeto para evitar duplicação de código e manter a interface consistente:

- **Botao** (`src/aplicacao/componentes/ui/Botao.tsx`)  
  - Variantes: `primario`, `secundario`, `perigo`, `texto`  
  - Usa `clsx` para composição de classes Tailwind  
  - Focado em ações claras e previsíveis

- **Input** (`src/aplicacao/componentes/ui/Input.tsx`)  
  - Suporte a `label`  
  - Estilo minimalista com foco em legibilidade  
  - Estados de foco com `focus:ring` e `focus:outline-none`

- **Card** (`src/aplicacao/componentes/ui/Card.tsx`)  
  - Fundo branco, borda suave e sombra leve  
  - Usado para agrupar informações (tutores, pets, seções)

- **Modal** (`src/aplicacao/componentes/ui/Modal.tsx`)  
  - Fundo com `backdrop-blur` e overlay semitransparente  
  - Conteúdo centralizado com bordas arredondadas  
  - Integração com o componente `Botao`

- **Titulo** (`src/aplicacao/componentes/ui/Titulo.tsx`)  
  - Define a hierarquia visual das páginas  
  - Usado em páginas principais (lista, detalhe, formulário)

- **Secao** (`src/aplicacao/componentes/ui/Secao.tsx`)  
  - Agrupa blocos de conteúdo com título e espaçamento consistente  
  - Facilita a leitura e organização visual das telas

### Composição de classes com clsx

Para manter o código mais limpo e legível, foi adicionada a dependência [`clsx`](https://www.npmjs.com/package/clsx), utilizada na composição de classes Tailwind em componentes reutilizáveis:

```ts
npm install clsx


## Arquitetura da Aplicação
A aplicação utiliza um arquitetura em camadas para separar responsabilidades:

src/
    - `aplicacao/`: Páginas, componentes, rotas e facades (UI)
    - `dominio/`: Modelos e contratos de negócio
    - `infraestrutura/`: Serviços HTTP, autenticação e integrações
    - `estado/`: Gerenciamento de estado com BehaviorSubject

Essa organização:
    - Facilita manutenção e evolução do código 
    - Reduz acoplamento entre UI e infraestrutura
    - Melhora testabilidade
    - Garante previsibilidade do fluxo de dados
    - Evita lógica de negócio espalhada nos componentes

A navegação é organizada em rotas públicas e privadas, com controle de acesso via autenticação.
O carregamento das páginas é feito sob demanda com React.lazy.

## Decisões Técnicas

    - Facade Pattern foi adotado para desacoplar a UI da lógica de negócio e da infraestrutura.

    - BehaviorSubject (RxJS) gerenciamento de estado previsível, evitando bibliotecas mais pesadas como Redux, já que o domínio é bem delimitado.

    - A UI não manipula dados diretamente: apenas dispara intenções e reage ao estado.

    - Schemas diferentes são utilizados para listagem e detalhamento, evitando tráfego desnecessário de dados.

    - Serviços HTTP possuem responsabilidade única, sem conhecimento de UI.

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

## Listagem de Tutores

Exibe tutores em formato de cards, com paginação e acesso à criação de novos registros.
A página consome exclusivamente a TutoresFacade.

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
