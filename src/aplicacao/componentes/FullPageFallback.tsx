export function FullPageFallback() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-100">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-lg font-semibold text-slate-700">
          Preparando as informações...
        </span>
      </div>

      <p className="text-sm text-slate-500">
        Só um instante, estamos buscando as informações necessárias.
      </p>
    </div>
  );
}
