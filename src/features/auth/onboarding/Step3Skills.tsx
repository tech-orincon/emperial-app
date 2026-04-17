import type { OnboardingFormData } from '../hooks/useOnboarding'
import type { GameCategoryDto } from '../../../types/reference.types'

interface Props {
  formData: OnboardingFormData
  errors: Record<string, string>
  gameCategories: GameCategoryDto[]
  selectedCategoryIds: number[]
  onChange: (field: string, value: unknown) => void
  onToggleCategory: (id: number) => void
}

const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-2 years', '3-5 years', '5+ years']

export function Step3Skills({
  formData, errors, gameCategories, selectedCategoryIds, onChange, onToggleCategory,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Experience & Services</h3>
        <p className="text-sm text-slate-400">What services can you provide?</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Years of Boosting Experience</label>
        <select
          value={formData.experience}
          onChange={(e) => onChange('experience', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          {EXPERIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-400">
          Services you can provide (Select all that apply) <span className="text-red-400">*</span>
        </label>
        {gameCategories.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            {formData.gameId
              ? 'No categories available for this game.'
              : 'Select a game in the previous step to see available services.'}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {gameCategories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${errors.services ? 'border-red-500/50' : 'border-white/10'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => onToggleCategory(cat.id)}
                  className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700"
                />
                <span className="text-sm text-slate-300">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
        {errors.services && <p className="text-xs text-red-400">{errors.services}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Highest Achievement</label>
        <input
          type="text"
          value={formData.highestAchievement}
          onChange={(e) => onChange('highestAchievement', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. Cutting Edge: Fyrakk, Rank 1 Gladiator"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Link to Raider.io / Armory (Optional)</label>
        <input
          type="url"
          value={formData.raiderioLink}
          onChange={(e) => onChange('raiderioLink', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://raider.io/characters/..."
        />
      </div>
    </div>
  )
}
