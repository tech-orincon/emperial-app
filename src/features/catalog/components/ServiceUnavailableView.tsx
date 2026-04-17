import { PackageX } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'

interface Props {
  onViewSimilar: () => void
  onReturnHome: () => void
}

export function ServiceUnavailableView({ onViewSimilar, onReturnHome }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="max-w-md p-8 text-center border-purple-500/20">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Service Unavailable</h2>
        <p className="text-slate-400 mb-8">
          This legendary service is currently unavailable. Our champions are preparing for the next season.
        </p>
        <div className="space-y-3">
          <Button className="w-full" onClick={onViewSimilar}>View Similar Services</Button>
          <Button variant="ghost" className="w-full" onClick={onReturnHome}>Return to Home</Button>
        </div>
      </GlassCard>
    </div>
  )
}
