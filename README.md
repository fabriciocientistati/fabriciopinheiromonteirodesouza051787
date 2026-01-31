# Pet e Tutores – Front-End

## Visão Geral do Projeto
Aplicação Front-End desenvolvida em React + TypeScript como parte de um
processo seletivo público do Governo do Estado de Mato Grosso.

## Tecnologias Utilizadas
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- RxJS (BehaviorSubject)

## Execução Local

```bash
npm install
npm run dev

## Arquitetura da Aplicação
A aplicação utiliza um arquitetura em camadas para separar responsabilidades:

src/
- `aplicacao/`: páginas, componentes, rotas e facades (orquestração)
- `dominio/`: modelos e contratos de negócio
- `infraestrutura/`: serviços HTTP, autenticação e negócio
- `estado/`: gerenciamento de estado com BehaviorSubject

Essa organização:
    - facilita manutenção 
    - reduz acoplamento
    - melhora testabilidade 
    - mantém prvisibilidade do fluxo de dados
    - evolução do projeto.

A navegação é organizada em rotas públicas e privadas, facilitando manutenção, leitura e controle de acesso. O Carregamento das páginas é feito sob demanda com React.lazy

## Facade do módulo de Tutores

O módulo de Tutores utiliza uma Facade para centralizar regras de negócio e interações com o estado e o serviço.

A Facade expõe métodos simples para a UI, como:
    - carregar lista paginada
    - carregar detalhes
    - criar e atualizar tutor
    - upload de foto
    - vincular e desvincular pets

Esse padrão reduz acoplamento, melhora testabilidade e mantém as páginas mais limpas.

## Serviço de Tutores

O módulo de Tutores possui um serviço dedicado (TutoresServico) responsável por toda comunicação com a API pública.
Ele implementa:

Listagem paginada de tutores

Busca por ID

Criação e atualização

Upload de foto

Listagem de pets vinculados

Vinculação e remoção de vínculo

Remover tutor

Remover foto

O serviço segue o padrão de responsabilidade única, sem lógica de UI, garantindo clareza e facilidade de manutenção.

## Gerenciamento de Estado (Pets e Tutores)

Os módulos de Pets e Tutores utilizam estados reativos baseados em BehaviorSubject, seguindo o mesmo padrão arquitetural.
Cada estado mantém:
    - lista paginada
    - item selecionado
    - flags de carregamento e criação
    - mensagens de erro
    - dados auxiliares (pets vinculados, no caso de tutores)

A atualização é sempre imutável e centralizada, garantindo previsibilidade, facilidade de testes e desacoplamento da UI.

## Facade Pattern

Chamam serviços HTTP, atualizam o estado reativo, mantêm a UI simples e previsível.

A aplicação utiliza o padrão Facade para desacoplar a camada de apresentação da infraestrutura. Os componentes interagem apenas com facades, que orquestram os serviços HTTP e atualizam o estado reativo via BehaviorSubject. Isso garante baixo acoplamento.

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

- nome
- raça
- idade
- foto do pet
- lista de tutores associados
- foto de cada tutor

A listagem utiliza apenas o schema resumido, enquanto o detalhamento carrega o
`PetResponseCompletoDto`, garantindo responsabilidade única e evitando tráfego
desnecessário de dados.

A imagem do pet e dos tutores é exibida diretamente a partir da URL fornecida
pela API, sem necessidade de chamadas adicionais.

## Criação de Pets com Upload de Imagem

A tela de criação de pets permite cadastrar um novo pet enviando:

- nome
- raça
- idade
- imagem (opcional)

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

## Rotas e Lazy Loading

As rotas de Pets e Tutores utilizam Lazy Loading com `React.lazy` e `Suspense`, rotas públicas e privadas, controle de acesso via autenticação,
isso permite carregamento sob demanda e melhor performance inicial dos componentes.

## Modelos de Domínio

Os modelos de domínio representam as entidades principais do sistema Pet, tutor e Foto, Refletido pela API.

Eles ficam isolados da camada da UI, facilitando tipagem forte, manutenção, testes e clareza.

## Camada HTTP e Serviços

A comunicação com a API é centralizada em uma camada de serviços, utilizando Axios configurado em um cliente HTTP único.

Cada serviço é responsável apenas por consumir endpoints específicos, mantendo a camada da UI desacoplada da infraestrutura.

Serviço separados por entidade, paginação implementada no backend e consumida pela Facade.

O controle de navegação entre páginas é realizado na camada de apresentação UI, com dados fornecidos pela Facade.

## Modelos de Domínio (Pets e Tutores)

Os modelos seguem estritamente o schema oficial da API pública, garantindo consistência e Clean Code.
Cada entidade é representada de forma isolada, evitando acoplamento indevido entre módulos.

## Autenticação e Segurança

Os contratos de autenticação (credenciais e tokens) são definidos na
camada de domínio, evitando tipagens soltas na infraestrutura.

A aplicação utiliza autenticação JWT, com login e renovação automática do token de acesso via refresh token.

O interceptador HTTP é responsável por injetar o token nas requisições e renovar a autenticação de forma transparente ao usuário.

A aplicação utiliza:

    - Login com JWT
    - Refresh Token automático
    - Interceptador que injeta nas requisições
    - Renovação transparente ao usuário

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
