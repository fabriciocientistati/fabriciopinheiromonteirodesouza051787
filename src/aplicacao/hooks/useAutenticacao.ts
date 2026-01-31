import { autenticacaoEstado } from '../../estado/autenticacaoEstado'
import { useObservable } from './useObservable'

export function useAutenticacao() {
  return useObservable(
    autenticacaoEstado.estado$,
    autenticacaoEstado.obterSnapshot()
  )
}
