import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navItem = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive ? 'text-white bg-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  )

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500" />
          <span className="font-extrabold text-xl tracking-tight">Meer Shoes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItem('/', 'Home')}
          {navItem('/shop', 'Shop')}
          {navItem('/about', 'About')}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/shop" className="relative inline-flex items-center">
            <ShoppingBag className="w-6 h-6 text-gray-700" />
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4 flex flex-col gap-2">
          {navItem('/', 'Home')}
          {navItem('/shop', 'Shop')}
          {navItem('/about', 'About')}
        </div>
      )}
    </header>
  )
}
