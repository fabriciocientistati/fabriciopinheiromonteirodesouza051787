import { Routes } from 'react-router-dom'
import { Suspense } from 'react'
import LayoutBase from '../layouts/LayoutBase'
import { FullPageFallback } from '../componentes/FullPageFallback'
import { RotasPublicas } from './RotasPublicas'
import { RotasPrivadas } from './RotasPrivadas'

export default function Rotas() {
  return (
    <LayoutBase>
      <Suspense fallback={<FullPageFallback />}>
        <Routes>
          {RotasPublicas()}
          {RotasPrivadas()}
        </Routes>
      </Suspense>
    </LayoutBase>
  )
}