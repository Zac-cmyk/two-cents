import { useState } from 'react'
import { ShoppingBag, Plane, Tv, MoreHorizontal, UtensilsCrossed } from 'lucide-react'

// fix the data here 
const CATEGORIES = [
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'entertainment', label: 'Entertainment', icon: Tv },
  { id: 'transport', label: 'Transport', icon: Plane },
  { id: 'misc', label: 'Misc', icon: MoreHorizontal },
]

export default function Log() {
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)

  function handleSubmit(category) {
    // send to backend here
    console.log({ amount, category: category.id})
  }

  return (
    <div className="p-8 flex flex-col gap-4 flex-center items-center">
      {/* amount input */}
      <div className="bg-[#d9d9d9] rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-gray-00 text-sm font-bold">How much did you spend?</p>
        <div className="flex items-cent8er gap-2">
          <span className="text-3xl font-bold text-gray-800">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="text-3xl font-bold text-gray-800 w-full outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

     <div className="bg-white rounded-2xl p-4">
        <p className="text-gray-800 text-sm font-bold mb-4">Select a category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isSelected = selected === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`w-[30%] flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                  isSelected ? 'bg-[#5B4FCF] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-white' : 'border-gray-800'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-center w-full truncate">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#5B4FCF] text-white rounded-xl py-3 font-semibold disabled:opacity-50"
        disabled={!amount || !selected}
      >
        log expense
      </button>
    </div>
  )
}