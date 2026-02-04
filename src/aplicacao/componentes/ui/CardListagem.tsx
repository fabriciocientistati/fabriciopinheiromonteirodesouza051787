import type { ReactNode } from 'react'
import { Card } from './Card'

type CardListagemProps = {
  titulo: string
  linhas: Array<string | null | undefined>
  imagemUrl?: string | null
  imagemAlt: string
  acoes: ReactNode
}

export function CardListagem({
  titulo,
  linhas,
  imagemUrl,
  imagemAlt,
  acoes,
}: CardListagemProps) {
  const linhasValidas = linhas.filter(
    (linha): linha is string => Boolean(linha && linha.trim()),
  )

  return (
    <Card className="p-4 flex flex-col sm:flex-row sm:items-start gap-6 min-h-[240px] hover:shadow-md transition">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:w-1/2">
        {imagemUrl ? (
          <img
            src={imagemUrl}
            alt={imagemAlt}
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Sem foto
          </div>
        )}

        <div className="mt-3 space-y-1 w-full">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight break-words">
            {titulo}
          </h3>
          {linhasValidas.map((linha, index) => (
            <p key={index} className="text-sm text-gray-600 break-words">
              {linha}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-1/2">
        {acoes}
      </div>
    </Card>
  )
}
