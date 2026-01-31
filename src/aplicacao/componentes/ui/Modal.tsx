import type { ReactNode } from 'react'
import { Botao } from './Botao'

export function Modal({
  aberto,
  titulo,
  children,
  onFechar
}: {
  aberto: boolean
  titulo: string
  children: ReactNode
  onFechar: () => void
}) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <Botao variante="texto" onClick={onFechar}>Fechar</Botao>
        </div>

        {children}
      </div>
    </div>
  )
}
