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
    <div className="bg-[#1e2a4a] min-h-screen p-6">
      {errorMessage && <p className="text-xs text-red-300 pb-3">{errorMessage}</p>}
      <h1 className="text-white text-2xl/6 font-black mb-6 flex items-center justify-center">
          Number of Friends ({user ? 1 : 0})
      </h1>
      <input
        type="text"
        placeholder="Search friends..."
        className="w-19/20 bg-[#2a3a5c] text-white placeholder-gray-400 rounded-4xl px-4 py-2 mb-2 outline-none focus:ring-1 focus:ring-white"
        disabled
      />

      {user && (
      <Link to={`/socials/${user.username}`}>
        <div className="bg-gray-400 w-19/20 rounded-xl p-3 flex items-center gap-3 relative border-4 border-white my-4">
          <span className="absolute top-2 right-3 text-gray-500 text-xs">
            {user.last_active_day ? `Last active ${user.last_active_day}` : 'No activity yet'}
          </span>
          <div className="bg-gray-500 rounded-full w-13 h-13 flex items-center justify-center overflow-hidden shrink-0">
            <img src={user.profile_picture || 'https://placehold.co/48'} alt="avatar" className="w-8 h-8 object-contain rounded-full"/>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-m">Lv. {pet?.level || 1}</p>
            <p className="text-gray-600 text-m">{user.username}</p>
          </div>
        </div>
      </Link>
      )}
      
    </div>
  );
}

export default Socials