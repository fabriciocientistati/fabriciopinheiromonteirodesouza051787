import { Routes } from 'react-router-dom'
import { Suspense } from 'react'
import { FullPageFallback } from '../componentes/FullPageFallback'
import { RotasPublicas } from './RotasPublicas'
import { RotasPrivadas } from './RotasPrivadas'

export default function Rotas() {
  return (
      <Suspense fallback={<FullPageFallback />}>
        <Routes>
          {RotasPublicas()}
          {RotasPrivadas()}
        </Routes>
      </Suspense>
  )
}