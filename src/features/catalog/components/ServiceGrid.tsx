import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ServiceCard, ServiceProps } from './ServiceCard';
import { Filter, ArrowDownUp } from 'lucide-react';
interface ServiceGridProps {
  category?: string;
}
// Mock data generator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMockServices = (_category: string): ServiceProps[] => {
  const baseServices = [
  {
    id: '1',
    title: 'Mythic+ 20 Timed Run',
    description:
    'Guaranteed timed completion with specific key selection available. Loot funnel options included.',
    price: 25,
    rating: 4.9,
    reviews: 1240,
    deliveryTime: '45 min',
    image:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
    badges: ['bestseller', 'instant'] as const
  },
  {
    id: '2',
    title: 'Amirdrassil Heroic Full Clear',
    description:
    'Full 9/9 raid clear with Ahead of the Curve achievement. VIP loot traders available.',
    price: 89,
    rating: 5.0,
    reviews: 856,
    deliveryTime: 'Scheduled',
    image:
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000',
    badges: ['verified'] as const
  },
  {
    id: '3',
    title: 'Keystone Master Bundle',
    description:
    'Get your 2000+ rating and mount in one package. Played by top 0.1% players.',
    price: 149,
    rating: 4.8,
    reviews: 342,
    deliveryTime: '2-3 Days',
    image:
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1000',
    badges: ['bestseller'] as const
  },
  {
    id: '4',
    title: 'Weekly Great Vault +18',
    description:
    'Secure your weekly max ilvl reward with a quick +18 completion.',
    price: 15,
    rating: 4.9,
    reviews: 2100,
    deliveryTime: '30 min',
    image:
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000',
    badges: ['instant'] as const
  },
  {
    id: '5',
    title: 'Gladiator Mount Boost',
    description:
    'Achieve the prestigious Gladiator rank and mount with our Rank 1 players.',
    price: 599,
    rating: 5.0,
    reviews: 45,
    deliveryTime: '2 Weeks',
    image:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1000',
    badges: ['verified'] as const
  },
  {
    id: '6',
    title: 'Specific Dungeon Farm',
    description:
    'Target specific loot from any dungeon. We run until it drops.',
    price: 35,
    rating: 4.7,
    reviews: 156,
    deliveryTime: 'Flexible',
    image:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
    badges: [] as const
  }];

  return baseServices;
};
export function ServiceGrid({ category }: ServiceGridProps) {
  const services = getMockServices(category);
  const [sortBy, setSortBy] = useState('popular');
  return (
    <div className="w-full">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {category === 'mythic-plus' ?
            'Mythic+ Dungeons' :
            category === 'raids' ?
            'Raid Carries' :
            category === 'gold' ?
            'Gold & Currency' :
            'Available Services'}
          </h2>
          <p className="text-slate-400">
            {services.length} services available for instant start
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emperial-500">
              
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ArrowDownUp className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) =>
        <motion.div
          key={service.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05
          }}>
          
            <ServiceCard service={service} />
          </motion.div>
        )}
      </div>
    </div>);

}