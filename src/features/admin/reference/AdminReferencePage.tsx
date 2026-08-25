import { useState } from 'react'
import { Toaster } from 'sonner'
import { AdminLayout } from '../components/AdminLayout'
import { CountriesTab } from './CountriesTab'
import { TimezonesTab } from './TimezonesTab'

type Tab = 'countries' | 'timezones'

const TABS: { id: Tab; label: string }[] = [
  { id: 'countries', label: 'Países' },
  { id: 'timezones', label: 'Zonas horarias' },
]

/** Datos de referencia que alimentan el Paso 1 del onboarding de providers. */
export function AdminReferencePage() {
  const [tab, setTab] = useState<Tab>('countries')

  return (
    <AdminLayout
      title="Referencia"
      description="Países y zonas horarias del formulario de onboarding."
    >
      <Toaster theme="dark" position="top-right" richColors />

      <div className="flex gap-1 mb-6 border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'countries' ? <CountriesTab /> : <TimezonesTab />}
    </AdminLayout>
  )
}
