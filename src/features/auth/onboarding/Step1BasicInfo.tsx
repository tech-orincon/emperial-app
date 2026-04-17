import type { OnboardingFormData } from '../hooks/useOnboarding'
import type { CountryDto, TimezoneDto } from '../../../types/reference.types'

interface Props {
  formData: OnboardingFormData
  errors: Record<string, string>
  countries: CountryDto[]
  timezones: TimezoneDto[]
  isLoadingStatic: boolean
  onChange: (field: string, value: unknown) => void
}

const selectCls = (error?: string) =>
  `w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none disabled:opacity-50 ${error ? 'border-red-500/50' : 'border-white/10'}`

const inputCls = (error?: string) =>
  `w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500/50' : 'border-white/10'}`

export function Step1BasicInfo({ formData, errors, countries, timezones, isLoadingStatic, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Basic Information</h3>
        <p className="text-sm text-slate-400">Tell us a bit about yourself.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Display Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
            className={inputCls(errors.displayName)}
            placeholder="e.g. Shadowblade"
          />
          {errors.displayName && <p className="text-xs text-red-400">{errors.displayName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Real Name (Optional)</label>
          <input
            type="text"
            value={formData.realName}
            onChange={(e) => onChange('realName', e.target.value)}
            className={inputCls()}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Country <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.countryId || ''}
            onChange={(e) => onChange('countryId', Number(e.target.value))}
            disabled={isLoadingStatic}
            className={selectCls(errors.countryId)}
          >
            <option value="">{isLoadingStatic ? 'Loading...' : 'Select a country'}</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.countryId && <p className="text-xs text-red-400">{errors.countryId}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Timezone <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            disabled={isLoadingStatic}
            className={selectCls(errors.timezone)}
          >
            <option value="">{isLoadingStatic ? 'Loading...' : 'Select a timezone'}</option>
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.name}>{tz.label}</option>
            ))}
          </select>
          {errors.timezone && <p className="text-xs text-red-400">{errors.timezone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Profile Bio</label>
        <textarea
          rows={4}
          value={formData.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Briefly describe your gaming background and what makes you a great booster..."
        />
      </div>
    </div>
  )
}
