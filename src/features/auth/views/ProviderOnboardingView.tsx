import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useOnboarding } from '../hooks/useOnboarding'
import { Step1BasicInfo } from '../onboarding/Step1BasicInfo'
import { Step2GamingProfile } from '../onboarding/Step2GamingProfile'
import { Step3Skills } from '../onboarding/Step3Skills'
import { Step4Availability } from '../onboarding/Step4Availability'
import { Step5Success } from '../onboarding/Step5Success'

const STEPS = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Gaming' },
  { id: 3, name: 'Experience' },
  { id: 4, name: 'Availability' },
  { id: 5, name: 'Success' },
]

export function ProviderOnboardingView() {
  const navigate = useNavigate()
  const {
    formData, gameProfileData, selectedCategoryIds,
    errors, isSavingStep, saveError, step, providerStatus,
    countries, timezones, games, gameAttributes, gameCategories,
    isLoadingStatic, isLoadingGame,
    handleInputChange, handleGameFieldChange,
    toggleSchedule, toggleCategory,
    nextStep, prevStep,
  } = useOnboarding()

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header + progress bar */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Provider Application</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-purple-500 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${step >= s.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-500 border border-white/10'}`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-purple-400' : 'text-slate-500'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GlassCard className="p-6 sm:p-8 overflow-hidden">
        {providerStatus === 'pending' && step < 5 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Application Under Review</h3>
            <p className="text-slate-400 mb-6">Your provider application is currently being reviewed by our team.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {saveError && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400 font-medium">{saveError}</p>
                  </div>
                )}

                {step === 1 && <Step1BasicInfo formData={formData} errors={errors} countries={countries} timezones={timezones} isLoadingStatic={isLoadingStatic} onChange={handleInputChange} />}
                {step === 2 && <Step2GamingProfile formData={formData} errors={errors} games={games} gameAttributes={gameAttributes} gameProfileData={gameProfileData} isLoadingStatic={isLoadingStatic} isLoadingGame={isLoadingGame} onChange={handleInputChange} onGameFieldChange={handleGameFieldChange} />}
                {step === 3 && <Step3Skills formData={formData} errors={errors} gameCategories={gameCategories} selectedCategoryIds={selectedCategoryIds} onChange={handleInputChange} onToggleCategory={toggleCategory} />}
                {step === 4 && <Step4Availability formData={formData} errors={errors} onChange={handleInputChange} onToggleSchedule={toggleSchedule} />}
                {step === 5 && <Step5Success />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              {step > 1 && step < 5 ? (
                <Button variant="ghost" onClick={prevStep} disabled={isSavingStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : <div />}

              {step < 5 && (
                <Button
                  onClick={nextStep}
                  disabled={isSavingStep}
                  className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]"
                >
                  {isSavingStep ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <>{step === 4 ? 'Submit Application' : 'Next Step'} <ChevronRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  )
}
