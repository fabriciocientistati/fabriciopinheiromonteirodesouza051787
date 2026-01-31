export function Secao({
  titulo,
  children
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-gray-800">{titulo}</h2>
      {children}
    </div>
  )
}
