import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Star, Clock, Zap } from 'lucide-react';
export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  image: string;
  badges?: ('verified' | 'bestseller' | 'instant')[];
}
export function ServiceCard({ service }: {service: ServiceProps;}) {
  return (
    <GlassCard
      hoverEffect
      className="flex flex-col h-full group overflow-hidden">
      
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${service.image})`
          }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {service.badges?.includes('bestseller') &&
          <span className="bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm">
              Best Seller
            </span>
          }
          {service.badges?.includes('instant') &&
          <span className="bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm flex items-center gap-1">
              <Zap className="w-3 h-3" /> Instant
            </span>
          }
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{service.rating}</span>
            <span className="text-slate-500">({service.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.deliveryTime}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emperial-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
          {service.description}
        </p>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">
              Starting from
            </span>
            <span className="text-xl font-bold text-white">
              ${service.price}
            </span>
          </div>
          <Button
            size="sm"
            className="bg-white/10 hover:bg-emperial-500 border-white/10">
            
            View Details
          </Button>
        </div>
      </div>
    </GlassCard>);

}