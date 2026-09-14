import type { ReactNode } from 'react'

interface Props {
  title: string
  hint?: string
  actions?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, hint, actions, children }: Props) {
  return (
    <section className="bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
