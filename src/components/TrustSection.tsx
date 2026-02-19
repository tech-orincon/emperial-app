import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, DollarSign, Lock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
const stats = [
{
  label: 'Raids Completed',
  value: '15,000+'
},
{
  label: 'TrustPilot Score',
  value: '4.9/5'
},
{
  label: 'Active Boosters',
  value: '500+'
}];

const features = [
{
  icon: Lock,
  title: 'Ironclad Security',
  description:
  'We use dedicated VPNs matching your country. Your account safety is our absolute priority.'
},
{
  icon: Zap,
  title: 'Legendary Speed',
  description:
  'Our Mythic+ teams and raid groups are ready 24/7. Most orders start within 15 minutes.'
},
{
  icon: DollarSign,
  title: 'Fair Loot Guarantee',
  description:
  "Didn't get the item you wanted? We offer free re-runs for loot funnel orders."
}];

export function TrustSection() {
  return (
    <section id="trust" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Refined Stats - More Minimal */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
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
            className="text-center">

              <div className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) =>
          <GlassCard key={feature.title} hoverEffect className="p-8">
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
              }}>

                <div className="w-12 h-12 rounded-xl bg-emperial-500/10 flex items-center justify-center mb-6 border border-emperial-500/20">
                  <feature.icon className="w-6 h-6 text-emperial-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </GlassCard>
          )}
        </div>
      </div>
    </section>);

}