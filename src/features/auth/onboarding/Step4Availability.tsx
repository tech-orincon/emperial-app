import type { OnboardingFormData } from '../hooks/useOnboarding'

interface Props {
  formData: OnboardingFormData
  errors: Record<string, string>
  onChange: (field: string, value: unknown) => void
  onToggleSchedule: (item: string) => void
}

const WEEKLY_OPTIONS = ['10-20 hours', '20-30 hours', '30-40 hours', '40+ hours']
const SCHEDULE_OPTIONS = ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible']
const PAYMENT_OPTIONS = ['PayPal', 'Bank Transfer', 'Crypto (USDT/USDC)']

export function Step4Availability({ formData, errors, onChange, onToggleSchedule }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Availability & Rates</h3>
        <p className="text-sm text-slate-400">Set your schedule and payment preferences.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Weekly Availability (Hours)</label>
        <select
          value={formData.weeklyHours}
          onChange={(e) => onChange('weeklyHours', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          {WEEKLY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-400">
          Preferred Schedule <span className="text-red-400">*</span>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {SCHEDULE_OPTIONS.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${errors.schedule ? 'border-red-500/50' : 'border-white/10'}`}
            >
              <input
                type="checkbox"
                checked={formData.schedule.includes(s)}
                onChange={() => onToggleSchedule(s)}
                className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700"
              />
              <span className="text-sm text-slate-300">{s}</span>
            </label>
          ))}
        </div>
        {errors.schedule && <p className="text-xs text-red-400">{errors.schedule}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Expected Hourly Rate ($) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => onChange('hourlyRate', e.target.value)}
              className={`w-full bg-slate-800 border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.hourlyRate ? 'border-red-500/50' : 'border-white/10'}`}
              placeholder="15"
            />
          </div>
          {errors.hourlyRate && <p className="text-xs text-red-400">{errors.hourlyRate}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => onChange('paymentMethod', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            {PAYMENT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
