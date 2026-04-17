import { Check, ShieldCheck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'

interface Package {
  id: string
  name: string
  price: number
  features: string[]
}

interface Addon {
  id: string
  name: string
  price: number
}

interface Props {
  packages: Package[]
  addonsList: Addon[]
  selectedPackage: string
  setSelectedPackage: (id: string) => void
  addons: string[]
  toggleAddon: (id: string) => void
  currentPackage: Package
  totalPrice: number
  onBuyNow: () => void
}

export function ServiceSidebar({
  packages, addonsList, selectedPackage, setSelectedPackage,
  addons, toggleAddon, currentPackage, totalPrice, onBuyNow,
}: Props) {
  return (
    <GlassCard className="p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6">Configure Order</h3>

      <div className="space-y-3 mb-8">
        <label className="text-sm font-medium text-slate-400">Select Tier</label>
        <div className="grid grid-cols-3 gap-2">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-3 rounded-lg border text-center transition-all ${selectedPackage === pkg.id ? 'bg-emperial-500/20 border-emperial-500 text-white' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}
            >
              <div className="text-sm font-bold">{pkg.name}</div>
              <div className="text-xs opacity-80">${pkg.price}</div>
            </button>
          ))}
        </div>
        <ul className="text-xs text-slate-400 space-y-1 mt-2 pl-1">
          {currentPackage.features.map((f) => (
            <li key={f} className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emperial-500" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 mb-8">
        <label className="text-sm font-medium text-slate-400">Add-ons</label>
        {addonsList.map((addon) => (
          <label
            key={addon.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addons.includes(addon.id)}
                onChange={() => toggleAddon(addon.id)}
                className="w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700"
              />
              <span className="text-sm text-slate-300">{addon.name}</span>
            </div>
            <span className="text-sm font-medium text-white">+${addon.price}</span>
          </label>
        ))}
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400">Total Price</span>
          <span className="text-3xl font-bold text-white">${totalPrice}</span>
        </div>
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onBuyNow}>Buy Now</Button>
          <Button variant="secondary" className="w-full" size="lg">Reserve Slot</Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          Secure Payment & Money-back Guarantee
        </div>
      </div>
    </GlassCard>
  )
}
