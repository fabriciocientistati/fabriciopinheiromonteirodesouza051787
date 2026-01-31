import { obterAccessToken } from './armazenamentoToken'

export function usuarioEstaAutenticado(): boolean {
  return Boolean(obterAccessToken())
}
