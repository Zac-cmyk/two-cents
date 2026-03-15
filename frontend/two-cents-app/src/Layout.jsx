import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Home, ShoppingCart, Users, PiggyBank } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authApi } from '@/api'

function Header() {
  const [isDark, setIsDark] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const authState = await authApi.me()
        setProfile(authState?.user ?? null)
      } catch {
        setProfile(null)
      }
    }

    loadProfile()
  }, [])

  function getFormattedDate() {
    return new Date().toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <header className="text-white px-6 pt-5 pb-4 flex justify-between items-center gap-4">
      <Link
        to="/socials"
        className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
      >
        {profile?.profile_picture ? (
          <img
            src={profile.profile_picture}
            alt={profile.username || 'Profile picture'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white jersey-font text-lg leading-none">
            {(profile?.username || 'me').slice(0, 2).toUpperCase()}
          </span>
        )}
      </Link>
      <span className="font-semibold text-2xl jersey-font tracking-wide text-center flex-1">{getFormattedDate()}</span>
      <button
        className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.14)] hover:bg-white/10 transition-colors"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? <Sun size={22} color="white" /> : <Moon size={22} color="white" />}
      </button>
    </header>
  )
}

function Footer() {
  const location = useLocation()

  const tabs = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/shop', icon: ShoppingCart, label: 'Shop' },
    { to: '/socials', icon: Users, label: 'Social' },
    { to: '/log', icon: PiggyBank, label: 'Log' },
  ]

  const isTabActive = (tabPath) => {
    if (tabPath === '/') {
      return location.pathname === '/'
    }

    return location.pathname === tabPath || location.pathname.startsWith(`${tabPath}/`)
  }
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
    <footer className="pointer-events-auto bg-[#5B4FCF] border border-white/10 rounded-[28px] flex justify-between items-center px-3 py-2.5 shadow-[0_18px_35px_rgba(28,21,67,0.42)]">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = isTabActive(to)
        return (
          <Link
            key={to}
            to={to}
            className={`min-w-18 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${
              active
                ? 'bg-white/18 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                : 'text-white/85 hover:bg-white/10'
            }`}
          >
            <Icon size={22} strokeWidth={2.4} color="white" className={`transition-transform ${active ? 'scale-110' : ''}`} />
            <span className={`text-[11px] jersey-font leading-none tracking-wide ${active ? 'text-white' : 'text-white/90'}`}>{label}</span>
          </Link>
        )
      })}
    </footer>
    </div>
  )
}

export default function Layout({ children }) {
  return (
    <div className="relative flex h-full flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>
      <Footer />
    </div>
  )
}