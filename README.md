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

## Arquitetura da Aplicação
A aplicação utiliza um arquitetura em camadas para separar responsabilidades:

- `aplicacao/`: páginas, componentes, rotas e facades (orquestração)
- `dominio/`: modelos TypeScript de negócio
- `infraestrutura/`: serviços HTTP e autenticação
- `estado/`: gerenciamento de estado com BehaviorSubject

Essa organização facilita manutenção, testes e evolução do projeto.

## Estrutura de Pastas
```text
src/
    aplicacao/
    dominio/
    infraestrutura/
    estado/
