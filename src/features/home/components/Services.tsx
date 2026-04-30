import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Coins, Skull } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { GlassCard } from '../../../components/ui/GlassCard';
const services = [
{
  title: 'Mythic+ Dungeons',
  price: '15',
  icon: Skull,
  description:
  'Secure your Keystone Master achievement and weekly Great Vault rewards.',
  features: [
  'Keys +2 to +25',
  'Timed Completion',
  'Specific Dungeon Selection',
  'Loot Funnel Available',
  'Self-play or Pilot'],

  popular: false,
  color: 'blue'
},
{
  title: 'Raid Carries',
  price: '49',
  icon: Crown,
  description:
  'Full clear runs for Amirdrassil on Heroic and Mythic difficulties.',
  features: [
  'Full 9/9 Clear',
  'Ahead of the Curve',
  'Tier Set Priority',
  'Mount Chances',
  'VIP Loot Funnel'],

  popular: true,
  color: 'purple'
},
{
  title: 'Gold & Items',
  price: '10',
  icon: Coins,
  description:
  'Instant delivery of gold across all realms and rare crafted items.',
  features: [
  '100k - 10M Gold',
  'Instant Trade',
  'Hand-farmed (Safe)',
  'Rare Mounts',
  'Profession Kits'],

  popular: false,
  color: 'blue'
}];

export function Services() {
  return (
    <section id="services" className="py-24 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            className="text-3xl md:text-4xl font-bold text-white mb-4">
            
            Choose Your Adventure
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
              delay: 0.1
            }}
            className="text-slate-400 text-lg">
            
            From high-key Mythic+ runs to full Mythic raid clears, our elite
            roster is ready to help you achieve your in-game goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) =>
          <GlassCard
            key={service.title}
            hoverEffect
            className={`p-8 flex flex-col relative ${service.popular ? 'border-emperial-500/50 bg-emperial-900/10' : ''}`}>
            
              {service.popular &&
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emperial-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-emperial-500/30 tracking-wide uppercase text-xs">
                  Best Seller
                </div>
            }

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
              transition={{
                delay: index * 0.1
              }}
              className="flex-1 flex flex-col">
              
                <div className="flex items-center justify-between mb-6">
                  <div
                  className={`p-3 rounded-xl ${service.popular ? 'bg-emperial-500/20 text-emperial-300' : 'bg-slate-800 text-slate-300'}`}>
                  
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-400 block">
                      Starting from
                    </span>
                    <span className="text-3xl font-bold text-white">
                      ${service.price}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-400 mb-8">{service.description}</p>

                <ul className="space-y-4 mb-8 flex-1">
                  {service.features.map((feature) =>
                <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emperial-500 shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                )}
                </ul>

                <Button
                variant={service.popular ? 'primary' : 'secondary'}
                className="w-full">
                
                  Select Service
                </Button>
              </motion.div>
            </GlassCard>
          )}
        </div>
      </div>
    </section>);

}