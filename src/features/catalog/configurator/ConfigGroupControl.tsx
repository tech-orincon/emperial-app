import type { ConfigGroup, ConfigOption } from '../../../types/service-config.types'

interface Props {
  group: ConfigGroup
  selected: number[]
  onPick: (group: ConfigGroup, optionId: number) => void
}

/** "+30%", "+$10.00", "$114.99" — el tipo cambia cómo se lee el número */
function priceHint(option: ConfigOption): string {
  const n = parseFloat(option.priceAmount)
  if (Number.isNaN(n) || n === 0) return ''
  if (option.priceKind === 'PERCENT') return `+${n}%`
  if (option.priceKind === 'FIXED') return `+$${n.toFixed(2)}`
  return `$${n.toFixed(2)}`
}

export function ConfigGroupControl({ group, selected, onPick }: Props) {
  const isOn = (id: number) => selected.includes(id)

  if (group.control === 'DROPDOWN') {
    const current = group.options.find((o) => isOn(o.id))
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">{group.label}</label>
        <select
          value={current?.id ?? ''}
          onChange={(e) => onPick(group, Number(e.target.value))}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emperial-500"
        >
          {!current && <option value="">Selecciona…</option>}
          {group.options.map((o) => (
            <option key={o.id} value={o.id} disabled={!o.isEnabled}>
              {o.label}
              {priceHint(o) && ` — ${priceHint(o)}`}
              {!o.isEnabled && ' (no disponible)'}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (group.control === 'SWITCH') {
    return (
      <div className="space-y-2">
        {group.options.map((o) => (
          <label
            key={o.id}
            className={`flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5 transition-colors ${
              o.isEnabled ? 'cursor-pointer hover:bg-slate-800/50' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isOn(o.id)}
                disabled={!o.isEnabled}
                onChange={() => onPick(group, o.id)}
                className="w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700"
              />
              <span className="text-sm text-slate-300">
                {o.label}
                {o.badge && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emperial-500/20 text-emperial-300">
                    {o.badge}
                  </span>
                )}
              </span>
            </div>
            <span className="text-sm font-medium text-white shrink-0 ml-2">{priceHint(o)}</span>
          </label>
        ))}
      </div>
    )
  }

  // BUTTONS
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{group.label}</label>
      <div className="flex flex-wrap gap-2">
        {group.options.map((o) => (
          <button
            key={o.id}
            disabled={!o.isEnabled}
            onClick={() => onPick(group, o.id)}
            className={`px-3 py-2 rounded-lg border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isOn(o.id)
                ? 'bg-emperial-500/20 border-emperial-500 text-white'
                : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {o.label}
            {priceHint(o) && <span className="ml-1.5 text-xs opacity-70">{priceHint(o)}</span>}
            {o.badge && <span className="ml-1.5 text-[10px] text-emperial-300">{o.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
