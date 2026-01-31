import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-xl p-4 shadow-sm',
        'hover:shadow-md transition',
        className
      )}
    >
      {children}
    </div>
  )
}
