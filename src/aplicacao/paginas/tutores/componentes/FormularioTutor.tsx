import { useState } from "react";
import type { Tutor } from "../../../../dominio/modelos/Tutor";
import { Input } from "../../../componentes/ui/Input";
import { Botao } from "../../../componentes/ui/Botao";
import { UploadFoto } from "../../../componentes/ui/UploadFoto";
import { useNavigate } from "react-router-dom";
import {
  formatarCpf,
  formatarTelefone,
  limparNumeros,
  normalizarCpf,
  validarCpf,
  validarEmail,
  validarTelefone,
} from "../../../utils/validacoes";

interface FormularioTutorProps {
  tutorInicial?: Tutor;
  onSubmit: (dados: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
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
  const [email, setEmail] = useState(tutorInicial?.email ?? "");
  const [telefone, setTelefone] = useState(
    limparNumeros(tutorInicial?.telefone ?? ""),
  );
  const [endereco, setEndereco] = useState(tutorInicial?.endereco ?? "");
  const [cpf, setCpf] = useState(normalizarCpf(tutorInicial?.cpf ?? ""));
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoRemovida, setFotoRemovida] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [erros, setErros] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cpf?: string;
  }>({});

  const telefoneFormatado = formatarTelefone(telefone);
  const cpfFormatado = formatarCpf(cpf);

  function validar() {
    const novoErros: typeof erros = {};

    if (!nome.trim()) novoErros.nome = "O nome é obrigatório.";

    if (!email.trim()) {
      novoErros.email = "O email é obrigatório.";
    } else if (!validarEmail(email)) {
      novoErros.email = "Email inválido.";
    }

    if (!telefone.trim()) {
      novoErros.telefone = "O telefone é obrigatório.";
    } else if (!validarTelefone(telefone)) {
      novoErros.telefone = "Telefone inválido.";
    }

    if (!endereco.trim()) {
      novoErros.endereco = "O endereço é obrigatório.";
    }

    if (!cpf.trim()) {
      novoErros.cpf = "O CPF é obrigatório.";
    } else if (!validarCpf(cpf)) {
      novoErros.cpf = "CPF inválido.";
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
        email,
        telefone: limparNumeros(telefone),
        endereco,
        cpf: limparNumeros(cpf),
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
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          erro={erros.email}
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

        <Input
          label="CPF"
          inputMode="numeric"
          value={cpfFormatado}
          onChange={(e) => setCpf(limparNumeros(e.target.value))}
          required
          className="w-full"
          erro={erros.cpf}
        />
      </div>

      <UploadFoto
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
