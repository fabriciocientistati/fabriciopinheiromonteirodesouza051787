import { Routes, Route, Navigate } from 'react-router-dom'
import LayoutBase from '../layouts/LayoutBase'

export default function Rotas() {
  return (
    <LayoutBase>
      <Routes>
        <Route path="/" element={<div>Página inicial</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LayoutBase>
  )
}
