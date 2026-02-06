import clsx from 'clsx'

type ImagemAvatarProps = {
  src?: string | null
  alt: string
  className?: string
  fallbackSrc?: string
} & Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'className'
>

export function ImagemAvatar({
  src,
  alt,
  className,
  fallbackSrc = '/sem-foto.png',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...props
}: ImagemAvatarProps) {
  const srcAtual = src ?? fallbackSrc

  return (
    <img
      key={srcAtual}
      src={srcAtual}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onLoad={onLoad}
      onError={(event) => {
        const img = event.currentTarget
        if (img.dataset.fallbackApplied === 'true') return
        img.dataset.fallbackApplied = 'true'
        img.src = fallbackSrc
        onError?.(event)
      }}
      className={clsx(
        'transition duration-300',
        className,
      )}
      {...props}
    />
  )
}
