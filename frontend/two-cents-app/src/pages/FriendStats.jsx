import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

function FriendStats() {
  const { username } = useParams()

  return (
    <div className="bg-[#1e2a4a] min-h-screen p-6 flex flex-col items-center">

      {/* Back button */}
      <Link to="/socials" className="self-start text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        ← Back
      </Link>

      {/* Avatar */}
        <div className="bg-[#e8f0f0] rounded-full w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
          <img src="https://placehold.co/60" alt="avatar" className="w-16 h-16 object-contain" />
        </div>

      {/* Name */}
      <p className="text-white font-bold text-xl">Lv. 12</p>
      <p className="text-gray-300 text-lg mb-6">{username}</p>

      {/* Pet scene */}
      <div className="w-full rounded-2xl overflow-hidden relative">
        <img src="https://placehold.co/600x400" alt="background" className="w-full object-cover" />
        <img
          src="https://placehold.co/80"
          alt="pet"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 object-contain"
        />
      </div>

    </div>
  )
}

export default FriendStats