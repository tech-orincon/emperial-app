import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Zap } from 'lucide-react';
import { Button } from './ui/Button';
const deals = [
{
  id: 'mythic-20',
  title: 'Mythic+ 20 Bundle',
  description: '4x Timed runs with loot funnel',
  originalPrice: 199,
  salePrice: 159,
  discount: 20,
  image:
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400',
  rating: 4.9,
  reviews: 342,
  tag: 'Best Value'
},
{
  id: 'heroic-clear',
  title: 'Heroic Raid Full Clear',
  description: 'Complete 9/9 with tier priority',
  originalPrice: 129,
  salePrice: 99,
  discount: 23,
  image:
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400',
  rating: 4.8,
  reviews: 218,
  tag: 'Popular'
},
{
  id: 'gold-pack',
  title: '1 Million Gold Pack',
  description: 'Instant delivery, any realm',
  originalPrice: 89,
  salePrice: 69,
  discount: 22,
  image:
  'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?auto=format&fit=crop&q=80&w=400',
  rating: 5.0,
  reviews: 567,
  tag: 'Flash Sale'
},
{
  id: 'ksm-boost',
  title: 'Keystone Master',
  description: 'Full KSM achievement + mount',
  originalPrice: 349,
  salePrice: 279,
  discount: 20,
  image:
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
  rating: 4.9,
  reviews: 156,
  tag: 'Limited'
}];

export function FeaturedDeals() {
  return (
    <section className="py-20 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emperial-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
            
            <Zap className="w-4 h-4" />
            Limited Time Offers
          </motion.div>
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="text-3xl md:text-4xl font-bold text-white mb-4">
            
            Featured Deals
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.2
            }}
            className="text-slate-400 text-lg max-w-2xl mx-auto">
            
            Grab these exclusive offers before they're gone
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, index) =>
          <motion.div
            key={deal.id}
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.1
            }}>
            
              <Link to={`/service/${deal.id}`} className="block group">
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-emperial-500/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${deal.image})`
                    }} />
                  
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-red-500 text-white text-sm font-bold shadow-lg">
                      -{deal.discount}%
                    </div>

                    {/* Tag */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-white border border-white/10">
                      {deal.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-sm font-medium">
                          {deal.rating}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        ({deal.reviews})
                      </span>
                    </div>

                    <h3 className="font-bold text-white mb-1 group-hover:text-emperial-300 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {deal.description}
                    </p>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-sm text-slate-500 line-through">
                          ${deal.originalPrice}
                        </span>
                        <span className="text-2xl font-bold text-white ml-2">
                          ${deal.salePrice}
                        </span>
                      </div>
                      <Button size="sm">View Offer</Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}