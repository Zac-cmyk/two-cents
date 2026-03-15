import { useEffect, useMemo, useState } from 'react'
import { Plane, Tv, MoreHorizontal, UtensilsCrossed } from 'lucide-react'
import { categoryApi, getApiErrorMessage } from '@/api'

const ICON_BY_CATEGORY = {
  food: UtensilsCrossed,
  entertainment: Tv,
  transport: Plane,
}

export default function Log() {
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const categoryOptions = useMemo(() => {
    return categories.map((category) => {
      const key = category.name?.toLowerCase().trim()
      const icon = ICON_BY_CATEGORY[key] || MoreHorizontal

      return {
        id: category.category_id,
        label: category.name,
        icon,
      }
    })
  }, [categories])

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const result = await categoryApi.getAll()
        setCategories(result || [])
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Failed to load categories'))
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  async function handleSubmit() {
    if (!selected || !amount) {
      return
    }

    setIsSubmitting(true)
    setFeedbackMessage('')
    setErrorMessage('')

    try {
      const result = await categoryApi.logExpenditure(selected, Number(amount))
      setAmount('')
      setFeedbackMessage(`Logged! Suggested daily budget is now $${Number(result?.suggested_daily_budget ?? 0).toFixed(2)}`)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to log expenditure'))
    } finally {
      setIsSubmitting(false)
    }
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
            className="text-3xl font-bold text-gray-800 w-full outline-none placeholder:text-gray-550"
          />
        </div>
      </div>

      {isLoading && <p className="text-xs text-white">Loading categories...</p>}
      {errorMessage && <p className="text-xs text-red-300">{errorMessage}</p>}
      {feedbackMessage && <p className="text-xs text-green-300">{feedbackMessage}</p>}

     <div className="bg-[#d9d9d9] rounded-2xl p-4">
        <p className="text-gray-800 text-sm font-bold mb-4">Select a category</p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(cat => {
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
        disabled={!amount || !selected || isSubmitting}
      >
        {isSubmitting ? 'logging...' : 'log expense'}
      </button>
    </div>
  )
}