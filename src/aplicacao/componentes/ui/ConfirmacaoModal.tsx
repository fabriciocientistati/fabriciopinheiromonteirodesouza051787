import type { ReactNode } from 'react'
import { Modal } from './Modal'

type ConfirmacaoModalProps = {
  aberto: boolean
  titulo: string
  mensagem: ReactNode
  onCancelar: () => void
  onConfirmar: () => void | Promise<void>
  textoConfirmar?: string
  textoCancelar?: string
}

export function ConfirmacaoModal({
  aberto,
  titulo,
  mensagem,
  onCancelar,
  onConfirmar,
  textoConfirmar,
  textoCancelar,
}: ConfirmacaoModalProps) {
  return (
    <Modal
      aberto={aberto}
      titulo={titulo}
      onFechar={onCancelar}
      onConfirmar={onConfirmar}
      textoConfirmar={textoConfirmar}
      textoCancelar={textoCancelar}
    >
      {mensagem}
    </Modal>
  )
}
