// import { useEffect, useState } from 'react'
// import { Botao } from './Botao'

// type UploadFotoProps = {
//   fotoInicial?: string | null
//   onChange: (arquivo: File | null) => void
//   label?: string
// }

// export function UploadFoto({ fotoInicial, onChange, label }: UploadFotoProps) {
//   const [preview, setPreview] = useState<string | null>(fotoInicial ?? null)

//   useEffect(() => {
//     if (fotoInicial !== preview) {
//       setPreview(fotoInicial ?? null)
//     }
//   }, [fotoInicial])

//   function aoSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
//     const arquivo = e.target.files?.[0]
//     if (!arquivo) return

//     const url = URL.createObjectURL(arquivo)
//     setPreview(url)
//     onChange(arquivo)
//   }

//   function removerFoto() {
//     setPreview(null)
//     onChange(null)
//   }

//   return (
//     <div className="space-y-2">

//       {label && <p className="font-medium">{label}</p>}

//       <div className="flex items-center gap-4">

//         <img
//           src={preview || '/sem-foto.png'}
//           alt="Foto"
//           className="w-24 h-24 rounded-full object-cover border"
//         />

//         <div className="flex flex-col gap-2">

//           <input
//             type="file"
//             accept="image/*"
//             onChange={aoSelecionarArquivo}
//             className="block"
//           />

//           {preview && (
//             <Botao
//               variante="perigo"
//               onClick={removerFoto}
//               className="w-fit"
//             >
//               Remover foto
//             </Botao>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
