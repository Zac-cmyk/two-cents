import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, Home, ShoppingCart, Users, PiggyBank } from 'lucide-react'
import { useState } from 'react'

function Header() {
  const [isDark, setIsDark] = useState(false) // to fix later -> dark mode needs to be implemented appwide

  function getFormattedDate() {
    return new Date().toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <header className=" text-white px-4 py-3 flex justify-between items-center">
      <button className="w-8 h-8 flex items-center justify-center">
        <Menu size={20} />
      </button>
      <span className="font-semibold text-sm">{getFormattedDate()}</span>
      <button
        className="w-8 h-8 flex items-center justify-center"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  )
}

function Footer() {
  const location = useLocation()

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: ShoppingCart, label: 'Shop' },
    { to: '/socials', icon: Users, label: 'Socials' },
    { to: '/log', icon: PiggyBank, label: 'Log' },
  ]

  return (
    <footer className="bg-[#5B4FCF] flex justify-around items-center py-2">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 px-4 py-1"
          >
            <Icon size={22} color={active ? '#ffffff' : '#1a1a2e'} />
          </Link>
        )
      })}
    </footer>
  )
}

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}