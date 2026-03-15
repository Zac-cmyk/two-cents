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
    <div className="min-h-full bg-linear-to-b from-[#1f2347] via-[#252a57] to-[#1b2043] px-5 py-5 text-white">
      <div className="mx-auto flex w-full max-w-90 flex-col gap-4">
        <div className="mb-1">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Daily Budget</p>
          <h1 className="pt-1 text-[24px] leading-none font-semibold">Log Expenditure</h1>
        </div>

        <div className="rounded-2xl border border-white/18 bg-white/12 p-4 shadow-[0_14px_36px_rgba(5,8,25,0.38)]">
          <p className="text-sm font-medium text-white/80">How much did you spend?</p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
            <span className="text-[28px] leading-none font-semibold text-white">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="w-full bg-transparent text-[28px] leading-none font-semibold text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        {isLoading && <p className="text-xs text-white/80">Loading categories...</p>}
        {errorMessage && (
          <p className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {errorMessage}
          </p>
        )}
        {feedbackMessage && (
          <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            {feedbackMessage}
          </p>
        )}

        <div className="rounded-2xl border border-white/18 bg-white/12 p-4 shadow-[0_14px_36px_rgba(5,8,25,0.38)]">
          <p className="mb-3 text-sm font-medium text-white/80">Select a category</p>

          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map(category => {
              const Icon = category.icon
              const isSelected = selected === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setSelected(category.id)}
                  className={`rounded-xl border px-2 py-2 transition ${
                    isSelected
                      ? 'border-[#7d6df2] bg-[#5B4FCF] text-white shadow-[0_8px_18px_rgba(63,50,156,0.5)]'
                      : 'border-white/12 bg-white/6 text-white/85 hover:bg-white/12'
                  }`}
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${
                      isSelected ? 'border-white/80' : 'border-white/35'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="mt-1 block truncate text-center text-[11px]">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-[#5B4FCF] py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(66,50,170,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!amount || !selected || isSubmitting}
        >
          {isSubmitting ? 'Logging...' : 'Log Expense'}
        </button>
      </div>
    </div>
  )
}