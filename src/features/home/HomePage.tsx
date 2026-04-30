import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Hero } from './components/Hero'
import { GameShowcase } from './components/GameShowcase'
import { FeaturedDeals } from './components/FeaturedDeals'
import { KeyFeatures } from './components/KeyFeatures'
import { HowItWorks } from './components/HowItWorks'
import { BoosterRecruitment } from './components/BoosterRecruitment'
import { Testimonials } from './components/Testimonials'
import { useHomeData } from './hooks/useHomeData'

export function HomePage() {
  const { games, offers, isLoading } = useHomeData()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-emperial-500/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <GameShowcase games={games} isLoading={isLoading} />
        <FeaturedDeals offers={offers} isLoading={isLoading} />
        <KeyFeatures />
        <HowItWorks />
        <BoosterRecruitment />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
