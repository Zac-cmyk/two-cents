import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Home, ShoppingCart, Users, PiggyBank } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { authApi } from '@/api'

function Header() {
  const [isDark, setIsDark] = useState(false)
  const [profile, setProfile] = useState(null)
  const headerRef = useRef(null)
  const avatarRef = useRef(null)
  const btnRef = useRef(null)

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', delay: 0.1 }
      )
      gsap.fromTo(
        [avatarRef.current, btnRef.current],
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.4, stagger: 0.08 }
      )
    })
    return () => ctx.revert()
  }, [])

  function getFormattedDate() {
    return new Date().toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <header ref={headerRef} className="relative text-white px-5 pt-5 pb-4 flex justify-between items-center gap-4">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <Link
        ref={avatarRef}
        to="/socials"
        className="w-11 h-11 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-white/14 transition-colors"
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
      <span className="font-semibold text-2xl jersey-font tracking-wide text-center flex-1 drop-shadow-[0_1px_8px_rgba(160,130,255,0.5)]">
        {getFormattedDate()}
      </span>
      <button
        ref={btnRef}
        className="w-11 h-11 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-white/14 transition-colors"
        onClick={() => {
          gsap.fromTo(btnRef.current, { rotate: -20, scale: 0.8 }, { rotate: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' })
          setIsDark(d => !d)
        }}
      >
        {isDark ? <Sun size={20} color="white" /> : <Moon size={20} color="white" />}
      </button>
    </header>
  )
}

function Footer() {
  const location = useLocation()
  const navRef = useRef(null)
  const tabRefs = useRef([])
  const glowRef = useRef(null)
  const prevActiveRef = useRef(null)

  const tabs = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/shop', icon: ShoppingCart, label: 'Shop' },
    { to: '/socials', icon: Users, label: 'Social' },
    { to: '/log', icon: PiggyBank, label: 'Log' },
  ]

  const activeIndex = tabs.findIndex(
    ({ to }) => location.pathname === to || location.pathname.startsWith(`${to}/`)
  )

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)', delay: 0.2 }
      )
      gsap.fromTo(
        tabRefs.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.45, stagger: 0.07 }
      )
    })
    return () => ctx.revert()
  }, [])

  // Glow dot slides to active tab
  useEffect(() => {
    if (activeIndex < 0 || !tabRefs.current[activeIndex] || !glowRef.current) return
    const tab = tabRefs.current[activeIndex]
    // Use offsetLeft + offsetWidth for position within the nav (not affected by viewport scroll/scale)
    const targetX = tab.offsetLeft + tab.offsetWidth / 2

    if (prevActiveRef.current === null) {
      gsap.set(glowRef.current, { x: targetX, xPercent: -50, opacity: 1 })
    } else {
      gsap.to(glowRef.current, { x: targetX, xPercent: -50, duration: 0.4, ease: 'power3.inOut' })
    }
    prevActiveRef.current = activeIndex
  }, [activeIndex])

  function handleTabClick(index) {
    const el = tabRefs.current[index]
    if (!el) return
    gsap.timeline()
      .to(el, { scale: 0.82, duration: 0.1, ease: 'power2.in' })
      .to(el, { scale: 1.12, duration: 0.18, ease: 'back.out(3)' })
      .to(el, { scale: 1, duration: 0.2, ease: 'power2.out' })
  }

  const isTabActive = (tabPath) =>
    location.pathname === tabPath || location.pathname.startsWith(`${tabPath}/`)

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 pointer-events-none">
      <footer
        ref={navRef}
        className="pointer-events-auto relative overflow-hidden flex justify-between items-center px-3 py-2.5 shadow-[0_-1px_0_rgba(255,255,255,0.06),0_-16px_40px_rgba(10,6,40,0.6)]"
        style={{ background: 'linear-gradient(180deg, rgba(38,28,100,0.85) 0%, rgba(22,16,70,0.97) 100%)', backdropFilter: 'blur(20px)' }}
      >
        {/* top edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

        {/* sliding glow indicator */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute top-0 h-0.5 w-10 rounded-full bg-linear-to-r from-violet-400 via-indigo-300 to-violet-400 shadow-[0_0_10px_4px_rgba(140,100,255,0.55)]"
          style={{ opacity: 0, left: 0 }}
        />

        {tabs.map(({ to, icon: Icon, label }, index) => {
          const active = isTabActive(to)
          return (
            <Link
              key={to}
              to={to}
              ref={el => { tabRefs.current[index] = el }}
              onClick={() => handleTabClick(index)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors duration-200 ${
                active ? 'text-white' : 'text-white/45 hover:text-white/70'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={`transition-all duration-200 ${active ? 'drop-shadow-[0_0_8px_rgba(180,150,255,0.8)]' : ''}`}
              />
              <span className={`text-[11px] jersey-font leading-none tracking-wider transition-all duration-200 ${active ? 'text-white' : 'text-white/45'}`}>
                {label}
              </span>
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
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}