import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, WifiOff, Shield, Percent } from 'lucide-react';
const features = [
{
  icon: Headphones,
  title: '24/7 Live Support',
  description:
  'Our support champions are always online to assist you with any questions or concerns.',
  color: 'from-blue-500 to-cyan-500',
  glow: 'blue'
},
{
  icon: WifiOff,
  title: 'Offline Mode',
  description:
  'Appear offline while our boosters work. Your friends will never know.',
  color: 'from-purple-500 to-pink-500',
  glow: 'purple'
},
{
  icon: Shield,
  title: 'VPN Protection',
  description:
  'We use premium VPNs matching your location for maximum account security.',
  color: 'from-green-500 to-emerald-500',
  glow: 'green'
},
{
  icon: Percent,
  title: 'Loyalty Cashback',
  description:
  'Earn up to 10% cashback on every order. The more you play, the more you save.',
  color: 'from-amber-500 to-orange-500',
  glow: 'amber'
}];

export function KeyFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-emperial-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
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
            className="inline-block text-emperial-400 font-medium text-sm uppercase tracking-wider mb-4">
            
            Why Choose Us
          </motion.span>
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
            className="text-3xl md:text-5xl font-bold text-white mb-4">
            
            Built for Gamers,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emperial-400 to-purple-400">
              By Gamers
            </span>
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
            
            We understand what matters to you because we're gamers too
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) =>
          <motion.div
            key={feature.title}
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
            }}
            className="group">
            
              <div className="relative h-full p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                {/* Subtle glow on hover */}
                <div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                  
                    <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}