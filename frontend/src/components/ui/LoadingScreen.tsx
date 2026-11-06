import { Brand } from '../layout/Brand'

export function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="flex flex-col items-center text-center">
        <Brand />
        <div className="mt-8 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-purple-700 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-plum/60">
          Loading your private space
        </p>
      </div>
    </main>
  )
}
