import axios from 'axios'
import type { AxiosError } from 'axios'
import { MENSAGENS_ERRO, MENSAGENS_STATUS_HTTP } from './mensagensErro'

export type ErroNormalizado = {
  mensagem: string
  status?: number
  codigo?: string
  detalhes?: string[]
}

const CHAVES_MENSAGEM = [
  'mensagem',
  'message',
  'error',
  'erro',
  'detail',
  'details',
  'title',
]

function extrairMensagemDeObjeto(obj: Record<string, unknown>): string | undefined {
  for (const chave of CHAVES_MENSAGEM) {
    const valor = obj[chave]
    if (typeof valor === 'string' && valor.trim()) {
      return valor.trim()
    }
  }

  const detalhes = extrairDetalhesApi(obj)
  if (detalhes && detalhes.length === 1) {
    return detalhes[0]
  }

  return undefined
}

function extrairMensagemApi(data: unknown): string | undefined {
  if (!data) return undefined
  if (typeof data === 'string') {
    return data.trim() || undefined
  }
  if (typeof data !== 'object') return undefined

  return extrairMensagemDeObjeto(data as Record<string, unknown>)
}

function extrairDetalhesApi(data: unknown): string[] | undefined {
  if (!data || typeof data !== 'object') return undefined

  const possivel = (data as Record<string, unknown>).errors
  if (!possivel) return undefined

  const detalhes: string[] = []

  const adicionar = (valor: unknown) => {
    if (typeof valor === 'string' && valor.trim()) {
      detalhes.push(valor.trim())
      return
    }
    if (valor && typeof valor === 'object') {
      const mensagem = extrairMensagemDeObjeto(valor as Record<string, unknown>)
      if (mensagem) detalhes.push(mensagem)
    }
  }

  if (Array.isArray(possivel)) {
    possivel.forEach(adicionar)
  } else if (typeof possivel === 'object') {
    Object.values(possivel as Record<string, unknown>).forEach(valor => {
      if (Array.isArray(valor)) {
        valor.forEach(adicionar)
      } else {
        adicionar(valor)
      }
    })
  } else {
    adicionar(possivel)
  }

  return detalhes.length ? detalhes : undefined
}

function extrairCodigoApi(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const obj = data as Record<string, unknown>
  const codigo = obj.codigo ?? obj.code
  if (typeof codigo === 'string' && codigo.trim()) return codigo.trim()
  if (typeof codigo === 'number' && Number.isFinite(codigo)) return String(codigo)

  return undefined
}

export function normalizarErro(
  erro: unknown,
  fallback: string = MENSAGENS_ERRO.GENERICO,
): ErroNormalizado {
  if (axios.isAxiosError(erro)) {
    const status = erro.response?.status
    const data = erro.response?.data
    const detalhes = extrairDetalhesApi(data)
    const codigo = extrairCodigoApi(data)
    const mensagemApi = extrairMensagemApi(data)

    if (mensagemApi) {
      return { mensagem: mensagemApi, status, codigo, detalhes }
    }

    if (erro.code === 'ECONNABORTED') {
      return { mensagem: MENSAGENS_ERRO.TIMEOUT, status, codigo, detalhes }
    }

    if (!erro.response) {
      return { mensagem: MENSAGENS_ERRO.FALHA_REDE, status, codigo, detalhes }
    }

    if (fallback) {
      return { mensagem: fallback, status, codigo, detalhes }
    }

    const mensagemStatus = status ? MENSAGENS_STATUS_HTTP[status] : undefined
    return {
      mensagem: mensagemStatus ?? MENSAGENS_ERRO.GENERICO,
      status,
      codigo,
      detalhes,
    }
  }

  if (erro instanceof Error) {
    const mensagem = erro.message?.trim()
    if (mensagem) {
      return { mensagem }
    }
  }

  if (typeof erro === 'string' && erro.trim()) {
    return { mensagem: erro.trim() }
  }

  return { mensagem: fallback || MENSAGENS_ERRO.GENERICO }
}

export function mensagemErro(
  erro: unknown,
  fallback: string = MENSAGENS_ERRO.GENERICO,
): string {
  return normalizarErro(erro, fallback).mensagem
}

export function erroEh401(erro: unknown): boolean {
  if (axios.isAxiosError(erro)) {
    return erro.response?.status === 401
  }

  const status = (erro as AxiosError | undefined)?.response?.status
  return status === 401
}
