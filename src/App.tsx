import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Rotas from './aplicacao/rotas/Rotas'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const onLogout = () => navigate('/login', { replace: true })

    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [navigate])

  return <Rotas />
}