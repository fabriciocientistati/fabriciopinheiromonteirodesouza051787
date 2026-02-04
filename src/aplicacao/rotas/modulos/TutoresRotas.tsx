import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'

const ListaTutoresPagina = lazy(() =>
  import('../../modulos/tutores/paginas/ListaTutoresPagina').then(m => ({
    default: m.ListaTutoresPagina,
  })),
)

const FormularioTutorPagina = lazy(() =>
  import('../../modulos/tutores/paginas/FormularioTutorPagina').then(m => ({
    default: m.FormularioTutorPagina,
  })),
)

const DetalheTutorPagina = lazy(() =>
  import('../../modulos/tutores/paginas/DetalheTutorPagina').then(m => ({
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
