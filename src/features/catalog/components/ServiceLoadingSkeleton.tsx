import { Skeleton } from '../../../components/ui/Skeleton'

export function ServiceLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} width={80} height={24} className="rounded" />)}
          </div>
          <Skeleton height={40} className="mb-4" />
          <div className="flex gap-6">
            <Skeleton width={100} height={20} />
            <Skeleton width={120} height={20} />
          </div>
        </div>

        <div className="border-b border-white/10 pb-4">
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} width={80} height={20} />)}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton height={20} />
          <Skeleton height={20} width="90%" />
          <Skeleton height={20} width="80%" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={24} />)}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <Skeleton width={150} height={24} className="mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
              <Skeleton width={120} height={20} className="mb-2" />
              <Skeleton width={180} height={16} />
            </div>
            <Skeleton width={100} height={36} className="rounded-lg" />
          </div>
        </div>
      </div>

      <div>
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sticky top-24">
          <Skeleton width={150} height={24} className="mb-6" />
          <Skeleton width={100} height={16} className="mb-3" />
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} height={60} className="rounded-lg" />)}
          </div>
          <Skeleton width={80} height={16} className="mb-3" />
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={48} className="rounded-lg mb-2" />)}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="flex justify-between mb-6">
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={32} />
            </div>
            <Skeleton height={48} className="rounded-lg mb-3" />
            <Skeleton height={48} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
