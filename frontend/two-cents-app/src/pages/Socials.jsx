import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authApi, getApiErrorMessage, petApi } from '@/api'

function Socials() {
  const [user, setUser] = useState(null)
  const [pet, setPet] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadSocials = async () => {
      setErrorMessage('')

      try {
        const [authState, petProgress] = await Promise.all([
          authApi.me(),
          petApi.getProgress().catch(() => null),
        ])

        setUser(authState?.user || null)
        setPet(petProgress)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Failed to load social data'))
      }
    }

    loadSocials()
  }, [])

  return (
    <div className="min-h-full bg-linear-to-b from-[#1f2347] via-[#252a57] to-[#1b2043] px-5 py-5 text-white">
      <div className="mx-auto w-full max-w-90">
        {errorMessage && (
          <p className="mb-3 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {errorMessage}
          </p>
        )}

        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Social</p>
            <h1 className="pt-1 text-[24px] leading-none font-semibold">Friends</h1>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
            {user ? 1 : 0} friend
          </span>
        </div>

        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/45">⌕</span>
          <input
            type="text"
            placeholder="Search friends"
            className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/45 outline-none"
            disabled
          />
        </div>

        {user && (
          <Link to={`/socials/${user.username}`} className="block">
            <div className="relative overflow-hidden rounded-2xl border border-white/18 bg-white/12 p-3 shadow-[0_14px_36px_rgba(5,8,25,0.38)] transition hover:bg-white/16">
              <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/8 px-2 py-1 text-[10px] text-white/75">
                {user.last_active_day ? `Last active ${user.last_active_day}` : 'No activity yet'}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-13 w-13 overflow-hidden rounded-full border border-white/20 bg-[#596389]">
                  <img
                    src={user.profile_picture || 'https://placehold.co/96x96'}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-white/70">Level {pet?.level || 1}</p>
                  <p className="text-base font-semibold text-white">@{user.username}</p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Socials