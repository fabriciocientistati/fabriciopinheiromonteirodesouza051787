import type { ReactNode } from "react"

type Props = {
    children: ReactNode
}

export default function LayoutBase({ children}: Props) {
    return (
     <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-lg font-semibold">
            Pets
            </h1>
        </header>

        <main className="p-6">
            {children}
        </main>
      </div>       
    )
}