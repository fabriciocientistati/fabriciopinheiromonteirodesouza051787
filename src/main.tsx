import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { configurarInterceptadorJwt } from './infraestrutura/autenticacao/interceptadorJwt.ts'
import { autenticacaoEstadoFacade } from './aplicacao/facades/AutenticacaoFacade.ts'

configurarInterceptadorJwt()
autenticacaoEstadoFacade.restaurarSessao()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
