import type { HTMLAttributes, ReactNode, KeyboardEvent } from 'react'
import clsx from 'clsx'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({
  children,
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: CardProps) {
  const clicavel = Boolean(onClick)
  const roleFinal = role ?? (clicavel ? 'button' : undefined)
  const tabIndexFinal = tabIndex ?? (clicavel ? 0 : undefined)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      clicavel &&
      event.currentTarget === event.target &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      event.currentTarget.click()
    }

    onKeyDown?.(event)
  }

  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-xl p-4 shadow-sm',
        'hover:shadow-md transition',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={roleFinal}
      tabIndex={tabIndexFinal}
      {...props}
    >
      {children}
    </div>
  )
}
