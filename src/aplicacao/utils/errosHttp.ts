import type { AxiosError } from 'axios'

export function erroEh401(erro: unknown): boolean {
  const status = (erro as AxiosError | undefined)?.response?.status
  return status === 401
}
