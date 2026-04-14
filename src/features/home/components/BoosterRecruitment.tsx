import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, DollarSign, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
const benefits = [
{
  icon: DollarSign,
  text: 'Earn $2,000+/month'
},
{
  icon: Clock,
  text: 'Flexible hours'
},
{
  icon: Users,
  text: 'Join 500+ boosters'
},
{
  icon: Trophy,
  text: 'Top performer bonuses'
}];

export function BoosterRecruitment() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-slate-900 to-emperial-900/20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emperial-500/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              
              <Trophy className="w-4 h-4" />
              Now Recruiting
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
              className="text-4xl md:text-5xl font-bold text-white mb-6">
              
              Join Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Elite Booster
              </span>{' '}
              Team
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
              className="text-xl text-slate-400 mb-8 max-w-xl">
              
              Turn your gaming skills into real income. Work from anywhere, set
              your own schedule, and join a community of professional players.
            </motion.p>

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
                delay: 0.3
              }}>
              
              <Link to="/provider/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 border-0 group">
                  
                  Become a Booster
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right - Benefits Grid */}
          <div className="flex-1 w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) =>
              <motion.div
                key={benefit.text}
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: 0.2 + index * 0.1
                }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
                
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="font-medium text-white">{benefit.text}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}