import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Breadcrumb } from './components/Breadcrumb'
import { GameSelector } from './components/GameSelector'
import { CategoryGrid } from './components/CategoryGrid'
import { ServiceGrid } from './components/ServiceGrid'
import { ErrorState } from '../../components/ui/ErrorState'
import { getGames } from '../../services/reference.service'
import { useCatalog } from './hooks/useCatalog'
import type { GameDto } from '../../types/reference.types'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [games, setGames] = useState<GameDto[]>([])
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [selectedGame, setSelectedGame] = useState<GameDto | null>(null)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)

  // Load game list once
  useEffect(() => {
    let cancelled = false
    getGames()
      .then((list) => {
        if (cancelled) return
        setGames(list)
        setIsLoadingGames(false)

        // Auto-select from URL param
        const slugParam = searchParams.get('game')
        const match = slugParam ? list.find((g) => g.slug === slugParam) : list[0]
        if (match) setSelectedGame(match)
      })
      .catch(() => {
        if (!cancelled) setIsLoadingGames(false)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { categories, servicesBySlug } = useCatalog(selectedGame?.id ?? null)

  const handleSelectGame = (game: GameDto) => {
    setSelectedGame(game)
    setSelectedCategorySlug(null)
    setSelectedCategoryName(null)
  }

  const handleSelectCategory = (slug: string, name: string) => {
    setSelectedCategorySlug(slug)
    setSelectedCategoryName(name)
  }

  const handleReset = () => {
    setSelectedCategorySlug(null)
    setSelectedCategoryName(null)
    navigate('/')
  }

  const handleClearCategory = () => {
    setSelectedCategorySlug(null)
    setSelectedCategoryName(null)
  }

  const categoryServices = selectedCategorySlug ? (servicesBySlug[selectedCategorySlug] ?? null) : null

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-emperial-500/30 selection:text-white">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24 min-h-screen">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emperial-500/5 rounded-full blur-[120px] opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            game={selectedGame?.name ?? ''}
            category={selectedCategoryName}
            onReset={handleReset}
            onClearCategory={handleClearCategory}
          />

          <GameSelector
            games={games}
            isLoading={isLoadingGames}
            selectedGameId={selectedGame?.id ?? null}
            onSelectGame={handleSelectGame}
          />

          <AnimatePresence mode="wait">
            {/* Categories error */}
            {categories.error && (
              <motion.div key="cat-error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-16">
                <ErrorState
                  title="Unable to load categories"
                  description="We couldn't fetch the categories for this game."
                  onRetry={() => setSelectedGame((g) => g ? { ...g } : g)}
                />
              </motion.div>
            )}

            {/* Category grid */}
            {!selectedCategorySlug && !categories.error && (
              <motion.div key="categories" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <CategoryGrid
                  categories={categories.data}
                  isLoading={categories.isLoading}
                  onSelectCategory={handleSelectCategory}
                />
              </motion.div>
            )}

            {/* Service grid */}
            {selectedCategorySlug && categoryServices && (
              <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <ServiceGrid
                  services={categoryServices.data}
                  categoryName={selectedCategoryName ?? ''}
                  isLoading={categoryServices.isLoading}
                  error={categoryServices.error}
                  onRetry={() => setSelectedCategorySlug((s) => s)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
