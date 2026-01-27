import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { limparTokens } from "../../infraestrutura/autenticacao/armazenamentoToken"

type Props = {
    children: ReactNode
}

export default function LayoutBase({ children }: Props) {
    const navigate = useNavigate()

    function sair() {
        limparTokens()
        navigate("/login", { replace: true })
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold">Pets</h1>

                <button
                    onClick={sair}
                    className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition"
                >
                    Sair
                </button>
            </header>

            <main className="p-6">
                {children}
            </main>
        </div>
    )
}
