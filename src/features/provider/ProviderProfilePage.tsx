import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import {
  ChevronLeft,
  Shield,
  Star,
  Award,
  Clock,
  CheckCircle2,
  Zap,
  MessageSquare,
  Calendar,
  Target } from
'lucide-react';
export function ProviderProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Mock provider data
  const provider = {
    id: id || 'shadowblade',
    name: 'Shadowblade',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadowblade',
    rank: 'Master',
    specialization: 'Mythic+ Specialist',
    isOnline: true,
    isVerified: true,
    stats: {
      jobsCompleted: 2400,
      rating: 4.9,
      totalReviews: 1240,
      yearsExperience: 3,
      completionRate: 99.8,
      avgResponseTime: '< 5 min'
    },
    badges: ['Verified', 'Top Rated', 'Fast Delivery', 'VIP Provider'],
    reviews: [
    {
      id: 1,
      customer: 'Arthas',
      rating: 5,
      text: 'Incredible run! Super fast and friendly. Got my loot and rating in no time.',
      date: 'Oct 24, 2023'
    },
    {
      id: 2,
      customer: 'Jaina',
      rating: 5,
      text: "Best booster I've worked with. Professional and efficient. Highly recommend!",
      date: 'Oct 22, 2023'
    },
    {
      id: 3,
      customer: 'Thrall',
      rating: 5,
      text: 'Smooth experience from start to finish. Will definitely use again.',
      date: 'Oct 20, 2023'
    }]

  };
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Profile Header */}
          <GlassCard className="p-8 mb-8 border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-purple-500/30" />
                
                {provider.isOnline &&
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                }
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {provider.name}
                  </h1>
                  {provider.isVerified &&
                  <Shield className="w-6 h-6 text-purple-400" />
                  }
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1">
                    <Award className="w-4 h-4" /> {provider.rank}
                  </span>
                  <span className="text-slate-400">
                    {provider.specialization}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {provider.badges.map((badge) =>
                  <span
                    key={badge}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-white/10">
                    
                      {badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Contact Provider
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
                delay: 0.1
              }}>
              
              <GlassCard className="p-5 text-center">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {provider.stats.jobsCompleted.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Jobs Completed</p>
              </GlassCard>
            </motion.div>

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
                delay: 0.2
              }}>
              
              <GlassCard className="p-5 text-center">
                <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  {provider.stats.rating}
                  <span className="text-sm text-slate-400">/ 5</span>
                </p>
                <p className="text-sm text-slate-400">
                  {provider.stats.totalReviews} Reviews
                </p>
              </GlassCard>
            </motion.div>

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
                delay: 0.3
              }}>
              
              <GlassCard className="p-5 text-center">
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {provider.stats.yearsExperience}+ Years
                </p>
                <p className="text-sm text-slate-400">Experience</p>
              </GlassCard>
            </motion.div>

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
                delay: 0.4
              }}>
              
              <GlassCard className="p-5 text-center">
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {provider.stats.completionRate}%
                </p>
                <p className="text-sm text-slate-400">Completion Rate</p>
              </GlassCard>
            </motion.div>

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
                delay: 0.5
              }}>
              
              <GlassCard className="p-5 text-center">
                <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {provider.stats.avgResponseTime}
                </p>
                <p className="text-sm text-slate-400">Avg Response</p>
              </GlassCard>
            </motion.div>

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
                delay: 0.6
              }}>
              
              <GlassCard className="p-5 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">Fast</p>
                <p className="text-sm text-slate-400">Delivery Speed</p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Reviews */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Customer Reviews
            </h2>
            <div className="space-y-6">
              {provider.reviews.map((review, index) =>
              <motion.div
                key={review.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.1 * index
                }}
                className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white">
                        {review.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {review.customer}
                        </p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) =>
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                    )}
                    </div>
                  </div>
                  <p className="text-slate-300">"{review.text}"</p>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>);

}