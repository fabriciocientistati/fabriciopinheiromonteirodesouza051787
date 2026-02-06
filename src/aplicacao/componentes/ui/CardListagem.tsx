import {
  useState,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { Card } from './Card'
import { ImagemAvatar } from './ImagemAvatar'

type CardListagemProps = {
  titulo: string
  linhas: Array<string | null | undefined>
  imagemUrl?: string | null
  imagemAlt: string
  acoes: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function CardListagem({
  titulo,
  linhas,
  imagemUrl,
  imagemAlt,
  acoes,
  onClick,
}: CardListagemProps) {
  const linhasValidas = linhas.filter(
    (linha): linha is string => Boolean(linha && linha.trim()),
  )
  const [acoesVisiveis, setAcoesVisiveis] = useState(!onClick)
  const cardClassName =
    'p-4 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition' +
    (onClick ? ' cursor-pointer' : '') +
    (acoesVisiveis ? ' min-h-[240px]' : '')

  const handleClick: MouseEventHandler<HTMLDivElement> | undefined = onClick
    ? event => {
        if (event.defaultPrevented) return
        const alvo = event.target
        if (alvo instanceof Element) {
          const interativo = alvo.closest(
            'button, a, input, select, textarea, [role="button"]',
          )
          if (interativo && interativo !== event.currentTarget) {
            return
          }
        }
        if (!acoesVisiveis) {
          setAcoesVisiveis(true)
          return
        }
        onClick(event)
      }
    : undefined

  const handleBlur: FocusEventHandler<HTMLDivElement> | undefined = onClick
    ? event => {
        const proximo = event.relatedTarget
        if (!(proximo instanceof Node) || !event.currentTarget.contains(proximo)) {
          setAcoesVisiveis(false)
        }
      }
    : undefined

  const conteudoClassName =
    'flex flex-col items-center text-center break-words' +
    (acoesVisiveis ? ' sm:w-1/2' : ' sm:w-full')

  const acoesClassName =
    'flex flex-col gap-2 w-full transition-all duration-300 ease-out overflow-hidden ' +
    (acoesVisiveis
      ? 'opacity-100 max-h-96 translate-y-0 pointer-events-auto sm:w-1/2'
      : 'opacity-0 max-h-0 -translate-y-1 pointer-events-none sm:w-0')

  const handleAcoesClick: MouseEventHandler<HTMLDivElement> = event => {
    if (onClick) {
      event.stopPropagation()
    }
  }

  return (
    <Card
      className={cardClassName}
      onClick={handleClick}
      onBlur={handleBlur}
    >
      <div className={conteudoClassName}>
        {imagemUrl ? (
          <ImagemAvatar
            src={imagemUrl}
            alt={imagemAlt}
            className="w-20 h-20 rounded-full object-cover border bg-white"
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

      <div
        className={acoesClassName}
        aria-hidden={!acoesVisiveis}
        onClick={handleAcoesClick}
      >
        {acoes}
      </div>
    </Card>
  )
}
