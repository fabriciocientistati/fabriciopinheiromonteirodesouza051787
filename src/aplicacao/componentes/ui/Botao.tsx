import clsx from "clsx"
import type { ReactNode } from "react"

type Variantes = 'primario' | 'secundario' | 'perigo' | 'texto'

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
      'bg-black text-white hover:bg-gray-800 active:bg-gray-900 transition',
    secundario:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 transition',
    perigo:
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition',
    texto:
      'text-black hover:text-gray-600 active:text-gray-800 transition'
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
