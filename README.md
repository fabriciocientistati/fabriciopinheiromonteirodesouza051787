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

## Execução Local

```bash
npm install
npm run dev

## Arquitetura da Aplicação
A aplicação utiliza um arquitetura em camadas para separar responsabilidades:

- `aplicacao/`: páginas, componentes, rotas e facades (orquestração)
- `dominio/`: modelos TypeScript de negócio
- `infraestrutura/`: serviços HTTP e autenticação
- `estado/`: gerenciamento de estado com BehaviorSubject

Essa organização facilita manutenção, testes e evolução do projeto.

A navegação é organizada em rotas públicas e privadas, facilitando manutenção, leitura e controle de acesso. O Carregamento das páginas é feito sob demanda com React.lazy

## Facade Pattern

A aplicação utiliza o padrão Facade para desacoplar a camada de apresentação da infraestrutura. Os componentes React interagem apenas com facades, que orquestram os serviços HTTP e atualizam o estado reativo via BehaviorSubject. Isso garante baixo acoplamento, previsibilidade e facilidade de testes.

## Gerenciamento de Estado com BehaviorSubject

O estado da aplicação é gerenciado com BehaviorSubject, conforme exigido no edital.
Cada entidade (Pets, Tutores) possui um estado centralizado.

## Listagem de Pets com Paginação e Fluxo de Edição de Pets

A listagem de pets utiliza paginação com tamanho fixo de 10 itens por página, conforme exigido no edital.

A paginação é controlada da seguinte forma:
A API recebe os parâmetros de página e tamanho
A Facade orquestra a chamada e atualiza o estado reativo
O estado centralizado mantém a página atual e o total de registros
A interface calcula o total de páginas e controla a navegação
Essa abordagem garante simplicidade, previsibilidade e separação clara de responsabilidades.

1. A UI solicita uma página específica à Facade 
2. A Facade orquestra mudanças de página e recarrega a lista. 
3. O estado centralizado é atualizado com: 
    - itens retornados pela API 
    - página atual 
    - total de registros 
    - remoção da foto existente


## Navegação para Detalhamento do Pet

Cada item da listagem de pets exibe um link “Ver detalhes”, que direciona o usuário para a rota `/pets/:id`.

A responsabilidade da listagem é apenas:

- exibir os pets da página atual
- permitir navegação entre páginas
- oferecer acesso ao detalhe de cada pet

O carregamento dos dados completos do pet é feito exclusivamente na tela de detalhamento, garantindo responsabilidade única e mantendo a lista leve e performática.

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

A interface inclui:

- validação de campos obrigatórios
- preview da imagem antes do envio
- feedback de erro
- botão para retornar à lista de pets

Esse fluxo mantém a responsabilidade única de cada endpoint e garante uma experiência consistente e previsível para o usuário.

## Atualização de Pets (com imagem e remoção de foto)

A aplicação agora permite atualizar os dados de um pet, incluindo:

- nome  
- raça  
- idade  
- imagem (opcional)

Durante a edição, o usuário pode:

- enviar uma nova imagem  
- visualizar a imagem atual  
- remover a foto existente  

A UI permanece simples e desacoplada, enquanto a Facade orquestra toda a lógica de negócio.  
As rotas foram atualizadas para incluir `/pets/:id/editar` com carregamento dinâmico (lazy loading).

## Estrutura de Pastas
```text
src/
    aplicacao/
    dominio/
    infraestrutura/
    estado/

## Rotas e Lazy Loading

As rotas de Pets e Tutores utilizam Lazy Loading com `React.lazy` e `Suspense`,
permitindo carregamento sob demanda e melhor performance inicial dos componentes.


## Modelos de Domínio

Os modelos de domínio representam as entidades principais do sistema Pet, tutor e Foto, Refletido pela API.

Eles ficam isolados da camada de apresentação, facilitando tipagem, manutenção e testes.

## Camada HTTP e Serviços

A comunicação com a API é centralizada em uma camada de serviços, utilizando Axios configurado em um cliente HTTP único.

Cada serviço é responsável apenas por consumir endpoints específicos, mantendo a camada de apresentação desacoplada da infraestrutura.

Os endpoints de listagem são preparados para paginação, utilizando parâmetros de página e tamanho fixo de 10 itens.
O controle de navegação entre páginas é realizado na camada de apresentação, com dados fornecidos pela Facade.

## Autenticação e Segurança

Os contratos de autenticação (credenciais e tokens) são definidos na
camada de domínio, evitando tipagens soltas na infraestrutura.

A aplicação utiliza autenticação JWT, com login e renovação automática do token de acesso via refresh token.

O interceptador HTTP é responsável por injetar o token nas requisições e renovar a autenticação de forma transparente ao usuário.


