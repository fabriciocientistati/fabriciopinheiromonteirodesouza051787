import { useState } from "react";
import type { TutorViewModel } from "../../../modelos";
import { Input } from "../../../componentes/ui/Input";
import { Botao } from "../../../componentes/ui/Botao";
import { UploadFoto } from "../../../componentes/ui/UploadFoto";
import { useNavigate } from "react-router-dom";
import {
  formatarTelefone,
  limparNumeros,
} from "../../../utils/validacoes";
import { MENSAGENS_VALIDACAO } from "../../../utils/mensagensValidacao";

interface FormularioTutorProps {
  tutorInicial?: TutorViewModel;
  onSubmit: (dados: {
    nome: string;
    telefone: string;
    endereco: string;
    foto?: File | null;
    removerFoto?: boolean;
  }) => Promise<void>;
  textoBotao?: string;
}

export function FormularioTutor({
  tutorInicial,
  onSubmit,
  textoBotao = "Salvar",
}: FormularioTutorProps) {
  const navigate = useNavigate();

  const [nome, setNome] = useState(tutorInicial?.nome ?? "");
  const [telefone, setTelefone] = useState(
    limparNumeros(tutorInicial?.telefone ?? ""),
  );
  const [endereco, setEndereco] = useState(tutorInicial?.endereco ?? "");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoRemovida, setFotoRemovida] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [erros, setErros] = useState<{
    nome?: string;
    telefone?: string;
    endereco?: string;
  }>({});

  const telefoneFormatado = formatarTelefone(telefone);

  function validar() {
    const novoErros: typeof erros = {};

    if (!nome.trim())
      novoErros.nome = MENSAGENS_VALIDACAO.NOME_OBRIGATORIO;

    if (!telefone.trim()) {
      novoErros.telefone = MENSAGENS_VALIDACAO.TELEFONE_OBRIGATORIO;
    }

    if (!endereco.trim()) {
      novoErros.endereco = MENSAGENS_VALIDACAO.ENDERECO_OBRIGATORIO;
    }

    setErros(novoErros);
    return Object.keys(novoErros).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validar()) return;

    setSalvando(true);
    try {
      await onSubmit({
        nome,
        telefone: limparNumeros(telefone),
        endereco,
        foto,
        removerFoto: fotoRemovida,
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border rounded-lg shadow-md p-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <Input
          label="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full"
          erro={erros.nome}
        />

        <Input
          label="Telefone"
          type="tel"
          inputMode="numeric"
          value={telefoneFormatado}
          onChange={(e) => setTelefone(limparNumeros(e.target.value))}
          required
          className="w-full"
          erro={erros.telefone}
        />

        <Input
          label="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          required
          className="w-full"
          erro={erros.endereco}
        />
      </div>

      <UploadFoto
        key={tutorInicial?.id ?? "novo"}
        fotoAtual={tutorInicial?.foto?.url}
        onUpload={(arquivo) => {
          setFoto(arquivo);
          setFotoRemovida(arquivo === null);
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Botao
          variante="perigo"
          type="button"
          onClick={() => navigate("/tutores")}
          className="w-full sm:w-auto"
        >
          Voltar
        </Botao>

        <Botao type="submit" disabled={salvando} className="w-full sm:w-auto">
          {salvando ? "Salvando..." : textoBotao}
        </Botao>
      </div>
    </form>
  );
}
