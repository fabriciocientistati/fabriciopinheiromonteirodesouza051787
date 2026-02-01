import { useState } from "react";
import type { Tutor } from "../../../../dominio/modelos/Tutor";
import { Input } from "../../../componentes/ui/Input";
import { Botao } from "../../../componentes/ui/Botao";
import { UploadFoto } from "../../../componentes/ui/UploadFoto";
import { useNavigate } from "react-router-dom";

interface FormularioTutorProps {
  tutorInicial?: Tutor;
  onSubmit: (dados: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
    foto?: File | null;
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
  const [telefone, setTelefone] = useState(tutorInicial?.telefone ?? "");
  const [endereco, setEndereco] = useState(tutorInicial?.endereco ?? "");
  const [cpf, setCpf] = useState(
    tutorInicial?.cpf ? String(tutorInicial.cpf) : "",
  );
  const [foto, setFoto] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [erros, setErros] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cpf?: string;
  }>({});

  function validar() {
    const novoErros: typeof erros = {};

    if (!nome.trim()) novoErros.nome = "O nome é obrigatório.";

    if (!email.trim()) {
      novoErros.email = "O email é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novoErros.email = "Email invalido.";
    }

    if (!telefone.trim()) {
      novoErros.telefone = "O telefone é obrigatório.";
    } else if (telefone.trim().length < 8) {
      novoErros.telefone = "Telefone invalido.";
    }

    if (!endereco.trim()) {
      novoErros.endereco = "O endereço é obrigatório.";
    }

    if (!cpf.trim()) {
      novoErros.cpf = "O CPF é obrigatório.";
    } else if (!/^\d{11}$/.test(cpf)) {
      novoErros.cpf = "CPF deve ter 11 Digitos.";
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
        telefone,
        endereco,
        cpf,
        foto,
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
          label="Nome"
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
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
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
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
          required
          className="w-full"
          erro={erros.cpf}
        />
      </div>

      <UploadFoto fotoAtual={tutorInicial?.foto?.url} onUpload={setFoto} />

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

