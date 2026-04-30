import { LogIn, UserPlus, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'

export function GuestNav() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="relative group">
        <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
          <ShoppingCart className="w-5 h-5" />
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-slate-400 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Login to checkout
        </div>
      </div>

      <Link to="/auth">
        <Button variant="ghost" size="sm" className="text-slate-400">Provider Portal</Button>
      </Link>

      <Link to="/auth">
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          <LogIn className="w-4 h-4" /> Login
        </Button>
      </Link>

      <Link to="/auth">
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Sign Up
        </Button>
      </Link>
    </div>
  )
}
