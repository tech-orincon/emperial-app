import { Loader2 } from 'lucide-react'
import type { OnboardingFormData } from '../hooks/useOnboarding'
import type { GameDto, GameAttributeDto } from '../../../types/reference.types'

interface Props {
  formData: OnboardingFormData
  errors: Record<string, string>
  games: GameDto[]
  gameAttributes: GameAttributeDto[]
  gameProfileData: Record<string, string | string[]>
  isLoadingStatic: boolean
  isLoadingGame: boolean
  onChange: (field: string, value: unknown) => void
  onGameFieldChange: (key: string, value: string | string[]) => void
}

const fieldCls = (error?: string) =>
  `w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500/50' : 'border-white/10'}`

function DynamicField({
  attr,
  value,
  error,
  onChange,
}: {
  attr: GameAttributeDto
  value: string | string[]
  error?: string
  onChange: (key: string, value: string | string[]) => void
}) {
  const label = (
    <label className="text-sm font-medium text-slate-400">
      {attr.label}{attr.isRequired && <span className="text-red-400"> *</span>}
    </label>
  )

  if (attr.inputType === 'TEXT' || attr.inputType === 'NUMBER') {
    return (
      <div className="space-y-2">
        {label}
        <input
          type={attr.inputType === 'NUMBER' ? 'number' : 'text'}
          value={value as string}
          onChange={(e) => onChange(attr.key, e.target.value)}
          className={fieldCls(error)}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (attr.inputType === 'SELECT') {
    return (
      <div className="space-y-2">
        {label}
        <select
          value={value as string}
          onChange={(e) => onChange(attr.key, e.target.value)}
          className={`${fieldCls(error)} appearance-none`}
        >
          <option value="">Select {attr.label}</option>
          {attr.options.map((opt) => (
            <option key={opt.id} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (attr.inputType === 'MULTI_SELECT') {
    const multi = (Array.isArray(value) ? value : []) as string[]
    return (
      <div className="space-y-3 sm:col-span-2">
        {label}
        <div className="grid sm:grid-cols-2 gap-3">
          {attr.options.map((opt) => (
            <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${error ? 'border-red-500/50' : 'border-white/10'}`}>
              <input
                type="checkbox"
                checked={multi.includes(opt.value)}
                onChange={() => {
                  const next = multi.includes(opt.value)
                    ? multi.filter((v) => v !== opt.value)
                    : [...multi, opt.value]
                  onChange(attr.key, next)
                }}
                className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700"
              />
              <span className="text-sm text-slate-300">{opt.label}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return null
}

export function Step2GamingProfile({
  formData, errors, games, gameAttributes, gameProfileData,
  isLoadingStatic, isLoadingGame, onChange, onGameFieldChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Gaming Credentials</h3>
        <p className="text-sm text-slate-400">Select your primary game and fill in your profile.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">
          Primary Game <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.gameId || ''}
          onChange={(e) => onChange('gameId', Number(e.target.value))}
          disabled={isLoadingStatic}
          className={`${fieldCls(errors.gameId)} appearance-none disabled:opacity-50`}
        >
          <option value="">{isLoadingStatic ? 'Loading...' : 'Select a game'}</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        {errors.gameId && <p className="text-xs text-red-400">{errors.gameId}</p>}
      </div>

      {formData.gameId > 0 && (
        isLoadingGame ? (
          <div className="flex items-center gap-3 py-4 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading game fields...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {gameAttributes.map((attr) => (
              <DynamicField
                key={attr.id}
                attr={attr}
                value={gameProfileData[attr.key] ?? (attr.inputType === 'MULTI_SELECT' ? [] : '')}
                error={errors[attr.key]}
                onChange={onGameFieldChange}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
