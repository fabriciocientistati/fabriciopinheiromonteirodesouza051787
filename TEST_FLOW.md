# Test Flow (Frontend Pets e Tutores)

## Objetivo
Executar um fluxo completo de testes para detectar falhas de build, integracao com API e regressao funcional.

## Escopo
- SPA React + TypeScript
- Autenticacao, listagens, detalhes, CRUD e vinculos (Pets e Tutores)
- Upload/remocao de imagem
- Rotas protegidas e refresh em URLs internas
- Health checks no container Nginx

## Pre-requisitos
- Node.js LTS e npm
- API disponivel em `https://pet-manager-api.geia.vip`
- Credenciais: `admin` / `admin`

## Comandos (ordem recomendada)
```bash
npm install
npm run lint
npm run test
npm run test:run
npm run build
npm run preview
```

## Smoke via Docker (opcional)
```bash
docker build -t frontend-pets-tutores .
docker run --rm -p 8080:80 frontend-pets-tutores
```

## Evidencias esperadas
- Lint sem erros.
- Tests verdes (Vitest).
- Build sem erros de TypeScript/Vite.
- App abre no preview e navega sem erro de console.
- Health checks no container retornam `200`:
  - `/healthz` e `/readyz`

## Registro de defeitos
Para cada falha, registrar:
- Passo exato e rota (ex.: `/pets/123`)
- Resultado esperado vs. resultado real
- Screenshot e log do console (se houver)
- Data/hora e ambiente (local, docker, versao do browser)

## Criterios de saida
- Todos os testes automatizados passam.
- Checklist QA completo sem falhas bloqueadoras.
- Sem erros de console em fluxos criticos.
