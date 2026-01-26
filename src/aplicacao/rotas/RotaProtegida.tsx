import { Navigate } from 'react-router-dom'
import { usuarioEstaAutenticado } from '../../infraestrutura/autenticacao/autenticacaoUtils'
import type { JSX } from 'react/jsx-dev-runtime'

interface Props {
    children: JSX.Element
}

export function RotaProtegida({ children }: Props) {
    if (!usuarioEstaAutenticado()) {
        return <Navigate to="/login" replace />
    }

    return children
}
