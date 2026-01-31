import clsx from 'clsx'

export function Input({
  label,
  className,
  ...props
}: {
  label?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}

      <input
        className={clsx(
          'w-full border border-gray-300 rounded-md px-3 py-2',
          'focus:outline-none focus:ring-2 focus:ring-black/10',
          'transition bg-white',
          className
        )}
        {...props}
      />
    </div>
  )
}
