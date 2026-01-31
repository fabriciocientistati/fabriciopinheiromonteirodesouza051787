import type { Tutor } from "../../../../dominio/modelos/Tutor";


export function CardTutor({ tutor, onClick }: { tutor: Tutor, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border rounded p-4 shadow hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <img
          src={tutor.foto?.url || '/sem-foto.png'}
          alt={tutor.nome}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">{tutor.nome}</p>
          <p className="text-sm text-gray-600">{tutor.telefone}</p>
        </div>
      </div>
    </div>
  )
}
