import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Briefcase, CheckCircle2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'

interface RoleSelectionViewProps {
  onSelectProvider: () => void
}

const CUSTOMER_FEATURES = [
  'Browse extensive marketplace',
  'Track orders in real-time',
  '24/7 premium support',
  'Secure payments & guarantees',
]

const PROVIDER_FEATURES = [
  'Set your own schedule',
  'Competitive payouts & bonuses',
  'Access to premium jobs',
  'Dedicated provider support',
]

export function RoleSelectionView({ onSelectProvider }: RoleSelectionViewProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How will you use Emperial Boosting?
        </h2>
        <p className="text-slate-400 text-lg">
          Choose your path. You can always switch later in your account settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard
          hoverEffect
          className="p-8 cursor-pointer border-2 border-transparent hover:border-emperial-500/50 group"
          onClick={() => navigate('/catalog')}
        >
          <div className="w-16 h-16 rounded-2xl bg-emperial-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-8 h-8 text-emperial-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Buy Services</h3>
          <p className="text-slate-400 mb-6">
            Browse and purchase premium gaming services from our verified experts.
          </p>
          <ul className="space-y-3 mb-8">
            {CUSTOMER_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emperial-500" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="w-full group-hover:bg-emperial-400">
            Continue as Customer <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>

        <GlassCard
          hoverEffect
          className="p-8 cursor-pointer border-2 border-transparent hover:border-purple-500/50 group"
          onClick={() => {
            toast.dismiss()
            onSelectProvider()
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Become a Booster</h3>
          <p className="text-slate-400 mb-6">
            Join our elite team of professional gamers and earn money doing what you love.
          </p>
          <ul className="space-y-3 mb-8">
            {PROVIDER_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="w-full bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] group-hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.7)]">
            Apply as Provider <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>
      </div>
    </div>
  )
}
