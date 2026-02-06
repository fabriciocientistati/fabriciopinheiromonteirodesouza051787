import { useEffect } from 'react'

type TipoToast = 'sucesso' | 'erro' | 'info'

interface Props {
  mensagem: string
  tipo?: TipoToast
  tempoMs?: number
  onFechar?: () => void
  acaoLabel?: string
  onAcao?: () => void
  posicao?: 'canto' | 'modal' | 'centro'
}

const estilosPorTipo: Record<TipoToast, string> = {
  sucesso: 'bg-emerald-600 border-emerald-700 text-white',
  erro: 'bg-red-600 border-red-700 text-white',
  info: 'bg-slate-900 border-slate-800 text-white',
}

export function Toast({
  mensagem,
  tipo = 'sucesso',
  tempoMs = 3000,
  onFechar,
  acaoLabel,
  onAcao,
  posicao = 'canto',
}: Props) {
  useEffect(() => {
    if (!mensagem || !onFechar) return
    const timeout = window.setTimeout(() => onFechar(), tempoMs)
    return () => window.clearTimeout(timeout)
  }, [mensagem, onFechar, tempoMs])

  const containerClassName =
    posicao === 'modal'
      ? 'absolute top-3 right-3 z-50 pointer-events-none'
      : posicao === 'centro'
      ? 'fixed inset-0 z-50 pointer-events-none flex items-center justify-center px-4'
      : 'fixed top-4 right-4 z-50 pointer-events-none'

  return (
    <div className={containerClassName}>
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${estilosPorTipo[tipo]}`}
        role="status"
        aria-live="polite"
      >
        <span className="flex-1">{mensagem}</span>
        {acaoLabel && onAcao && (
          <button
            type="button"
            onClick={onAcao}
            className="text-white/90 hover:text-white underline underline-offset-2"
          >
            {acaoLabel}
          </button>
        )}
        {onFechar && (
          <button
            type="button"
            onClick={onFechar}
            className="text-white/80 hover:text-white"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  )
}
