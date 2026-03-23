import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, Sword } from 'lucide-react';
import { Button } from './ui/Button';
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements - Esports Premium Style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle premium glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emperial-500/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] opacity-30" />

        {/* Refined Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge - MMO Fantasy Context */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emperial-500/10 border border-emperial-500/20 text-emperial-300 text-sm font-medium mb-8 backdrop-blur-sm">
          
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emperial-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emperial-500"></span>
          </span>
          Accepting Orders for The War Within
        </motion.div>

        {/* Headline - Epic Fantasy Tone */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.1
          }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl">
          
          Conquer Azeroth with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emperial-400 to-purple-400">
            Legendary Speed
          </span>
        </motion.h1>

        {/* Subheading - Trust & Professionalism */}
        <motion.p
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.2
          }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          
          Elite boosting services for World of Warcraft. Secure your Mythic+
          rating, claim rare mounts, and dominate raids with our verified
          professional guild.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.3
          }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          
          <Button size="lg" className="w-full sm:w-auto group">
            Browse Services
            <Sword className="ml-2 w-4 h-4 transition-transform group-hover:rotate-45" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            View Raid Schedule
          </Button>
        </motion.div>

        {/* Social Proof Mini */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 1,
            delay: 0.5
          }}
          className="mt-12 flex items-center gap-6 text-sm text-slate-500">
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                
                  <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`}
                  alt="User"
                  className="w-full h-full" />
                
                </div>
              )}
            </div>
            <span className="font-medium text-slate-300">
              50k+ Bosses Defeated
            </span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-slate-300">4.9/5 TrustScore</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="font-medium text-slate-300">
              100% Account Safe
            </span>
          </div>
        </motion.div>
      </div>
    </section>);

}