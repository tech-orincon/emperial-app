import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

const NEXT_STEPS = [
  'Our team will review your application within 24-48 hours.',
  "You'll receive an email with a link to join our Provider Discord server.",
  'Complete a brief verification run to unlock premium jobs.',
]

export function Step5Success() {
  const navigate = useNavigate()

  return (
    <div className="py-8 text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-12 h-12 text-green-400" />
      </motion.div>

      <div>
        <h3 className="text-3xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          We are reviewing your profile. Welcome to the team!
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 max-w-md mx-auto border border-white/5 text-left">
        <h4 className="font-medium text-white mb-4">What happens next?</h4>
        <ul className="space-y-4">
          {NEXT_STEPS.map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-400">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-300">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => navigate('/')}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]"
      >
        Go to Home <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
