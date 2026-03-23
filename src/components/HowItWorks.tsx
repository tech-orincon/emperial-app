import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Trophy, ChevronRight } from 'lucide-react';
const steps = [
{
  icon: Search,
  number: '01',
  title: 'Choose Your Service',
  description:
  'Browse our catalog of raids, dungeons, and boosting services. Customize your order with add-ons.'
},
{
  icon: CreditCard,
  number: '02',
  title: 'Secure Payment',
  description:
  'Complete your purchase with our encrypted payment system. We accept all major cards and PayPal.'
},
{
  icon: Trophy,
  number: '03',
  title: 'Track & Receive',
  description:
  'Monitor your order in real-time. Get notified instantly when your service is complete.'
}];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emperial-500/5 blur-[100px] rounded-full pointer-events-none" />

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
            
            Simple Process
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
            className="text-3xl md:text-4xl font-bold text-white mb-4">
            
            How It Works
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
            
            Get started in minutes with our streamlined process
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-emperial-500/30 to-transparent" />

          {steps.map((step, index) =>
          <motion.div
            key={step.title}
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
              delay: index * 0.15
            }}
            className="relative">
            
              <div className="flex flex-col items-center text-center group">
                {/* Step Number & Icon */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center relative z-10 group-hover:border-emperial-500/30 transition-colors duration-300">
                    <step.icon className="w-12 h-12 text-emperial-400" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-emperial-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emperial-500/30">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps (mobile) */}
              {index < steps.length - 1 &&
            <div className="flex justify-center my-6 md:hidden">
                  <ChevronRight className="w-6 h-6 text-emperial-500/50 rotate-90" />
                </div>
            }
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}