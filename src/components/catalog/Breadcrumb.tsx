import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
interface BreadcrumbProps {
  game: string;
  category?: string | null;
  onReset: () => void;
  onClearCategory: () => void;
}
export function Breadcrumb({
  game,
  category,
  onReset,
  onClearCategory
}: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-slate-400 mb-8">
      <button
        onClick={onReset}
        className="flex items-center hover:text-white transition-colors">
        
        <Home className="w-4 h-4 mr-2" />
        Home
      </button>

      <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />

      <span
        className={
        category ?
        'hover:text-white cursor-pointer transition-colors' :
        'text-white font-medium'
        }
        onClick={category ? onClearCategory : undefined}>
        
        {game}
      </span>

      {category &&
      <>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="text-white font-medium">{category}</span>
        </>
      }
    </nav>);

}