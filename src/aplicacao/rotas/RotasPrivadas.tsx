import { Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RotaProtegida } from './RotaProtegida'
import { LayoutPrivado } from '../layouts/LayoutPrivado'

const PetsRotas = lazy(() =>
  import('./modulos/PetsRotas').then(m => ({ default: m.PetsRotas })),
)

const TutoresRotas = lazy(() =>
  import('./modulos/TutoresRotas').then(m => ({ default: m.TutoresRotas })),
)

export function RotasPrivadas() {
  return (
    <Route element={<RotaProtegida />}>
      <Route element={<LayoutPrivado />}>
        <Route path="/" element={<Navigate to="/pets" replace />} />

        <Route path="/pets/*" element={<PetsRotas />} />
        <Route path="/tutores/*" element={<TutoresRotas />} />

        <Route path="*" element={<Navigate to="/pets" replace />} />
      </Route>
    </Route>
  )
}
