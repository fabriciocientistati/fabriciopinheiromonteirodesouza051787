import { useId } from 'react'
import clsx from 'clsx'

export function Input({
  label,
  erro,
  className,
  ...props
}: {
  label?: string
  erro?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const idGerado = useId()
  const idCampo = props.id ?? idGerado
  const idErro = erro ? `${idCampo}-erro` : undefined

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-700" htmlFor={idCampo}>
          {label}
        </label>
      )}

      <input
        className={clsx(
          'w-full border rounded-md px-3 py-2',
          'focus:outline-none focus:ring-2 focus:ring-black/10',
          erro ? 'border-red-500 focus:ring-red-200' : 'border-gray-300',
          'transition bg-white',
          className
        )}
        id={idCampo}
        aria-invalid={Boolean(erro)}
        aria-describedby={idErro}
        {...props}
      />

      {erro && (
        <p id={idErro} className="text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  )
}
