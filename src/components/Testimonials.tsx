import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
const testimonials = [
{
  quote:
  'Got my Keystone Master achievement in just two days. The team was super professional and traded me all the loot at the end.',
  author: 'Kaelthas_Fan',
  rank: '2500 IO',
  game: 'World of Warcraft'
},
{
  quote:
  "Finally got the Mythic mount I've been farming for years. The pilot was safe, used a VPN, and streamed the whole thing on Discord.",
  author: 'JainaProud',
  rank: 'Mythic Raider',
  game: 'World of Warcraft'
},
{
  quote:
  'Bought 5M gold for consumables and crafting. Delivered instantly to my mailbox. Best prices I found online.',
  author: 'GoblinTrade',
  rank: 'Gold Buyer',
  game: 'World of Warcraft'
}];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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

            Guild Chat
          </motion.h2>
          <p className="text-slate-400 text-lg">
            See what other champions are saying about their experience with
            Emperial Boosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) =>
          <GlassCard key={index} hoverEffect className="p-8">
              <motion.div
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1
              }}>

                <Quote className="w-8 h-8 text-emperial-500/40 mb-6" />
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emperial-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{item.author}</div>
                    <div className="text-xs text-slate-500">{item.rank}</div>
                  </div>
                </div>
              </motion.div>
            </GlassCard>
          )}
        </div>
      </div>
    </section>);

}