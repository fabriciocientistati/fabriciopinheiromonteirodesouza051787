import React from 'react'
import { Botao } from './Botao'

type ModalProps = {
  aberto: boolean
  titulo: string
  children: React.ReactNode
  onFechar: () => void
  onConfirmar?: () => void | Promise<void>
  textoConfirmar?: string
  textoCancelar?: string
}

export function Modal({
  aberto,
  titulo,
  children,
  onFechar,
  onConfirmar,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
}: ModalProps) {
  if (!aberto) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="
        fixed inset-0 bg-black/40 
        flex items-center justify-center 
        p-4 z-[9999]
      "
    >
      <div
        className="
          w-full max-w-lg bg-white 
          rounded-lg p-4 shadow-xl
          animate-fadeIn
        "
      >
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-lg font-semibold m-0">{titulo}</h2>

          <button
            onClick={onFechar}
            aria-label="Fechar modal"
            className="
              text-xl leading-none 
              bg-transparent border-none 
              cursor-pointer hover:text-red-500
            "
          >
            ✕
          </button>
        </div>

        <div className="mt-3">
          {children}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Botao onClick={onFechar}>
            {textoCancelar}
          </Botao>

          {onConfirmar && (
            <Botao variante="perigo" onClick={onConfirmar}>
              {textoConfirmar}
            </Botao>
          )}
        </div>
      </div>
    </div>
  )
}
