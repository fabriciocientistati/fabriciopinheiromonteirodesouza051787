import clsx from "clsx"
import type { ReactNode } from "react"

type Variantes =
  | 'primario'
  | 'secundario'
  | 'perigo'
  | 'texto'
  | 'primario-azul'
  | 'laranja'
  | 'sucesso'

export function Botao({
  children,
  variante = 'primario',
  className,
  ...props
}: {
  children: ReactNode
  variante?: Variantes
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const estilos = {
    primario:
      'bg-[#193282] text-white hover:bg-[#1f3da0] active:bg-[#162a6a] transition',

    secundario:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 transition',

    perigo:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition',

    texto:
      'text-[#193282] hover:text-[#1f3da0] active:text-[#162a6a] transition',

    'primario-azul':
      'bg-[#193282] text-white hover:bg-[#1f3da0] active:bg-[#162a6a] transition',

    laranja:
      'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 transition',

    sucesso:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition',
  }

  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md font-medium',
        estilos[variante],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
