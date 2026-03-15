import { Link } from 'react-router-dom'

function Socials() {
  return (
    <div className="bg-[#1e2a4a] min-h-screen p-6">
      {/* button that  */}
      <h1 className="text-white text-2xl/6 font-black mb-6 flex items-center justify-center">
          Number of Friends (3)
      </h1>
      <input
        type="text"
        placeholder="Search friends..."
        className="w-19/20 bg-[#2a3a5c] text-white placeholder-gray-400 rounded-4xl px-4 py-2 mb-2 outline-none focus:ring-1 focus:ring-white"
      />
      <Link to="/socials/haystacc">
        <div className="bg-gray-400 w-19/20 rounded-xl p-3 flex items-center gap-3 relative border-4 border-white my-4">
          <span className="absolute top-2 right-3 text-gray-500 text-xs">
            Last login...
          </span>
          <div className="bg-gray-500 rounded-full w-13 h-13 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://placehold.co/48" alt="avatar" className="w-8 h-8 object-contain rounded-full"/>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-m">Lv. 12</p>
            <p className="text-gray-600 text-m">haystacc</p>
          </div>
        </div>
      </Link>
      <Link to="/socials/haystacc">
        <div className="bg-gray-400 w-19/20 rounded-xl p-3 flex items-center gap-3 relative border-4 border-white my-4">
          <span className="absolute top-2 right-3 text-gray-500 text-xs">
            Last login...
          </span>
          <div className="bg-gray-500 rounded-full w-13 h-13 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://placehold.co/48" alt="avatar" className="w-8 h-8 object-contain rounded-full"/>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-m">Lv. 12</p>
            <p className="text-gray-600 text-m">haystacc</p>
          </div>
        </div>
      </Link>
      
    </div>
  );
}

export default Socials