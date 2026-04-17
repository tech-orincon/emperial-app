import { useState } from 'react'
import { toast } from 'sonner'
import {
  startOnboarding,
  updateGamingProfile,
  saveSkills,
  saveAvailability,
  type ScheduleEnum,
} from '../../../services/auth.service'
import type { GameAttributeDto } from '../../../types/reference.types'
import { useReferenceData } from './useReferenceData'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingFormData {
  displayName: string
  realName: string
  countryId: number
  timezone: string
  bio: string
  gameId: number
  experience: string
  highestAchievement: string
  raiderioLink: string
  weeklyHours: string
  schedule: string[]
  hourlyRate: string
  paymentMethod: string
}

// ─── Static mapping tables ────────────────────────────────────────────────────

const EXPERIENCE_YEARS: Record<string, number> = {
  'Less than 1 year': 0,
  '1-2 years': 1,
  '3-5 years': 3,
  '5+ years': 5,
}

const WEEKLY_HOURS: Record<string, number> = {
  '10-20 hours': 15,
  '20-30 hours': 25,
  '30-40 hours': 35,
  '40+ hours': 45,
}

const SCHEDULE_ENUM: Record<string, ScheduleEnum> = {
  'Weekday mornings': 'WEEKDAY_MORNING',
  'Weekday evenings': 'WEEKDAY_EVENING',
  Weekends: 'WEEKEND',
  Flexible: 'FLEXIBLE',
}

const INITIAL_FORM: OnboardingFormData = {
  displayName: '',
  realName: '',
  countryId: 0,
  timezone: '',
  bio: '',
  gameId: 0,
  experience: 'Less than 1 year',
  highestAchievement: '',
  raiderioLink: '',
  weeklyHours: '10-20 hours',
  schedule: [],
  hourlyRate: '',
  paymentMethod: 'PayPal',
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOnboarding() {
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM)
  const [gameProfileData, setGameProfileData] = useState<Record<string, string | string[]>>({})
  const [providerGameProfileId, setProviderGameProfileId] = useState(0)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSavingStep, setIsSavingStep] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [providerStatus, setProviderStatus] = useState<'none' | 'pending'>('none')

  const referenceData = useReferenceData(formData.gameId || null)

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (s: number): boolean => {
    const errs: Record<string, string> = {}
    if (s === 1) {
      if (!formData.displayName || formData.displayName.length < 3)
        errs.displayName = 'Display name must be at least 3 characters'
      if (!formData.countryId) errs.countryId = 'Country is required'
      if (!formData.timezone) errs.timezone = 'Timezone is required'
    } else if (s === 2) {
      if (!formData.gameId) errs.gameId = 'Please select a game'
      for (const attr of referenceData.gameAttributes.filter((a: GameAttributeDto) => a.isRequired)) {
        const val = gameProfileData[attr.key]
        if (!val || (Array.isArray(val) && val.length === 0))
          errs[attr.key] = `${attr.label} is required`
      }
    } else if (s === 3) {
      if (selectedCategoryIds.length === 0) errs.services = 'Select at least one service'
    } else if (s === 4) {
      if (formData.schedule.length === 0) errs.schedule = 'Select at least one schedule option'
      if (!formData.hourlyRate || parseInt(formData.hourlyRate) <= 0)
        errs.hourlyRate = 'Valid hourly rate is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'gameId') {
      setGameProfileData({})
      setSelectedCategoryIds([])
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleGameFieldChange = (key: string, value: string | string[]) => {
    setGameProfileData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const toggleSchedule = (item: string) => {
    setFormData((prev) => {
      const newArr = prev.schedule.includes(item)
        ? prev.schedule.filter((i) => i !== item)
        : [...prev.schedule, item]
      if (errors.schedule && newArr.length > 0)
        setErrors((e) => ({ ...e, schedule: '' }))
      return { ...prev, schedule: newArr }
    })
  }

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev: number[]) => {
      const newArr = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      if (errors.services && newArr.length > 0)
        setErrors((e) => ({ ...e, services: '' }))
      return newArr
    })
  }

  // ── Step navigation ────────────────────────────────────────────────────────

  const nextStep = async () => {
    if (!validate(step)) return
    setIsSavingStep(true)
    setSaveError(null)
    try {
      if (step === 1) {
        await startOnboarding({
          displayName: formData.displayName,
          realName: formData.realName || undefined,
          countryId: formData.countryId,
          timezone: formData.timezone,
        })
      } else if (step === 2) {
        const slugAttr = referenceData.gameAttributes.find(
          (a: GameAttributeDto) =>
            a.inputType === 'TEXT' &&
            ['name', 'tag', 'id', 'username', 'gamertag'].some((k) =>
              a.key.toLowerCase().includes(k),
            ),
        )
        const slug = slugAttr
          ? ((gameProfileData[slugAttr.key] as string) ?? formData.displayName)
          : formData.displayName

        const apiData: Record<string, unknown> = {}
        for (const attr of referenceData.gameAttributes) {
          const val = gameProfileData[attr.key]
          if (val !== undefined && val !== '')
            apiData[attr.key] = attr.inputType === 'NUMBER' ? Number(val) : val
        }

        const profile = await updateGamingProfile({ gameId: formData.gameId, slug, data: apiData })
        setProviderGameProfileId(profile.id)
      } else if (step === 3) {
        await saveSkills({
          providerProfileExperience: {
            yearExperience: String(EXPERIENCE_YEARS[formData.experience] ?? 0),
            highestAchievement: formData.highestAchievement,
          },
          providerGameSkill: selectedCategoryIds.map((gameCategoryId) => ({
            providerGameProfileId,
            gameCategoryId,
          })),
        })
      } else if (step === 4) {
        await saveAvailability({
          weeklyHours: WEEKLY_HOURS[formData.weeklyHours] ?? 15,
          schedules: formData.schedule.map((s) => SCHEDULE_ENUM[s]).filter(Boolean) as ScheduleEnum[],
          hourlyRate: parseInt(formData.hourlyRate, 10),
          paymentMethod: formData.paymentMethod,
        })
        setProviderStatus('pending')
      }
      toast.success('Progress saved')
      setStep((s) => Math.min(5, s + 1))
    } catch {
      setSaveError("We couldn't save your progress. Please try again.")
      toast.error('Failed to save progress')
    } finally {
      setIsSavingStep(false)
    }
  }

  const prevStep = () => {
    setErrors({})
    setSaveError(null)
    setStep((s) => Math.max(1, s - 1))
  }

  return {
    formData,
    gameProfileData,
    selectedCategoryIds,
    errors,
    isSavingStep,
    saveError,
    step,
    providerStatus,
    ...referenceData,
    handleInputChange,
    handleGameFieldChange,
    toggleSchedule,
    toggleCategory,
    nextStep,
    prevStep,
  }
}
