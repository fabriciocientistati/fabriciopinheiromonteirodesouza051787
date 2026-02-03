import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'

const ListaTutoresPagina = lazy(() =>
  import('../../paginas/tutores/ListaTutoresPagina').then(m => ({
    default: m.ListaTutoresPagina,
  })),
)

const FormularioTutorPagina = lazy(() =>
  import('../../paginas/tutores/FormularioTutorPagina').then(m => ({
    default: m.FormularioTutorPagina,
  })),
)

const DetalheTutorPagina = lazy(() =>
  import('../../paginas/tutores/DetalheTutorPagina').then(m => ({
    default: m.DetalheTutorPagina,
  })),
)

export function TutoresRotas() {
  return (
    <Routes>
      <Route index element={<ListaTutoresPagina />} />
      <Route path="novo" element={<FormularioTutorPagina />} />
      <Route path=":id/editar" element={<FormularioTutorPagina />} />
      <Route path=":id" element={<DetalheTutorPagina />} />
    </Routes>
  )
}
