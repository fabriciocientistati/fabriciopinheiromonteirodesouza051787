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

Os endpoints de listagem já são preparados para paginação, utilizando
parâmetros de página e tamanho fixo de 10 itens.

## Autenticação e Segurança

Os contratos de autenticação (credenciais e tokens) são definidos na
camada de domínio, evitando tipagens soltas na infraestrutura.

A aplicação utiliza autenticação JWT, com login e renovação automática do token de acesso via refresh token.

O interceptador HTTP é responsável por injetar o token nas requisições e renovar a autenticação de forma transparente ao usuário.


