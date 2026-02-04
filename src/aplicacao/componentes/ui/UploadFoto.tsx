import { useState } from 'react'
import { Botao } from './Botao'

interface UploadFotoProps {
  fotoAtual?: string
  label?: string
  onUpload: (arquivo: File | null) => void
}

export function UploadFoto({
  fotoAtual,
  label = 'Foto',
  onUpload,
}: UploadFotoProps) {
  const [previewLocal, setPreviewLocal] = useState<string | null>(fotoAtual ?? null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    onUpload(arquivo)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewLocal(reader.result as string)
    }
    reader.readAsDataURL(arquivo)
  }

  function removerFoto() {
    setPreviewLocal(null)
    onUpload(null)
  }

  const preview = previewLocal ?? null

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border shadow-sm bg-gray-100">
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização da foto"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sem foto
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="text-sm"
          />

          {preview && (
            <Botao
              variante="perigo"
              type="button"
              onClick={removerFoto}
              className="px-2 py-1 text-xs w-fit"
            >
              Remover foto
            </Botao>
          )}
        </div>
      </div>
    </div>
  )
}
