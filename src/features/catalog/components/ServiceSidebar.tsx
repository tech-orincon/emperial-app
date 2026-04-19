import { Check, ShieldCheck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import type { ServicePackageDto, ServiceAddonDetailDto, ServiceActiveOfferDto } from '../../../types/catalog.types'

interface Props {
  packages: ServicePackageDto[]
  addons: ServiceAddonDetailDto[]
  activeOffer: ServiceActiveOfferDto | null | undefined
  selectedPackageId: number | null
  setSelectedPackageId: (id: number) => void
  selectedAddonIds: number[]
  toggleAddon: (id: number) => void
  onBuyNow: () => void
}

export function ServiceSidebar({
  packages, addons, activeOffer,
  selectedPackageId, setSelectedPackageId,
  selectedAddonIds, toggleAddon, onBuyNow,
}: Props) {
  const selectedPkg = packages.find((p) => p.id === selectedPackageId) ?? packages[0] ?? null
  const basePrice = selectedPkg ? parseFloat(activeOffer?.finalPrice ?? selectedPkg.price) : 0
  const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const addon = addons.find((a) => a.id === addonId)
    return sum + (addon ? parseFloat(addon.price) : 0)
  }, 0)
  const totalPrice = basePrice + addonsTotal

  return (
    <GlassCard className="p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6">Configure Order</h3>

      {packages.length > 0 && (
        <div className="space-y-3 mb-8">
          <label className="text-sm font-medium text-slate-400">Select Tier</label>
          <div className={`grid gap-2 ${packages.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {packages.map((pkg) => {
              const isSelected = (selectedPackageId ?? packages[0]?.id) === pkg.id
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`relative p-3 rounded-lg border text-center transition-all ${isSelected ? 'bg-emperial-500/20 border-emperial-500 text-white' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-emperial-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      Popular
                    </span>
                  )}
                  <div className="text-sm font-bold">{pkg.name}</div>
                  <div className="text-xs opacity-80">${pkg.price}</div>
                </button>
              )
            })}
          </div>
          {selectedPkg && selectedPkg.features.length > 0 && (
            <ul className="text-xs text-slate-400 space-y-1 mt-2 pl-1">
              {selectedPkg.features.map((f) => (
                <li key={f} className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emperial-500" /> {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {addons.length > 0 && (
        <div className="space-y-3 mb-8">
          <label className="text-sm font-medium text-slate-400">Add-ons</label>
          {addons.map((addon) => (
            <label
              key={addon.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedAddonIds.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700"
                />
                <div>
                  <span className="text-sm text-slate-300">{addon.name}</span>
                  {addon.description && <p className="text-xs text-slate-500">{addon.description}</p>}
                </div>
              </div>
              <span className="text-sm font-medium text-white shrink-0 ml-2">+${addon.price}</span>
            </label>
          ))}
        </div>
      )}

      {activeOffer && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
          <span className="text-emerald-400 font-medium">
            {activeOffer.discountPct ? `${activeOffer.discountPct}% off applied` : 'Offer applied'}
          </span>
          {activeOffer.originalPrice && (
            <span className="text-slate-500 line-through ml-2">${activeOffer.originalPrice}</span>
          )}
        </div>
      )}

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400">Total Price</span>
          <span className="text-3xl font-bold text-white">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onBuyNow} disabled={!selectedPkg}>
            Buy Now
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          Secure Payment & Money-back Guarantee
        </div>
      </div>
    </GlassCard>
  )
}
