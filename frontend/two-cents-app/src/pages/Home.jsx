// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import happyCat from '../assets/happyCat.gif'
import beach from '../assets/beach.gif'
import bowtie from '../assets/bowtie.png'
import { categoryApi, getApiErrorMessage, petApi, userApi } from '@/api'

const INITIAL_STATE = {
  pet: {
    name: 'Pet',
    hearts: 0,
    maxHearts: 3,
    healthPercent: 0,
    state: 'happy',
    level: 1,
    experience: 0,
    experienceInLevel: 0,
    nextLevelExperience: 100,
  },
  categories: [],
}

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`
const toTitleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

function getHealthMeta(healthPercent) {
  if (healthPercent >= 80) {
    return {
      label: 'Happy',
      trackClassName: 'bg-emerald-200/20',
      indicatorClassName: 'bg-linear-to-r from-emerald-300 to-green-400',
      badgeClassName: 'bg-emerald-400/15 text-emerald-100 border-emerald-300/20',
    }
  }

  if (healthPercent >= 50) {
    return {
      label: 'Sad',
      trackClassName: 'bg-amber-200/20',
      indicatorClassName: 'bg-linear-to-r from-amber-200 to-orange-300',
      badgeClassName: 'bg-amber-300/15 text-amber-100 border-amber-200/20',
    }
  }

  return {
    label: 'Mad',
    trackClassName: 'bg-rose-200/20',
    indicatorClassName: 'bg-linear-to-r from-rose-400 to-red-500',
    badgeClassName: 'bg-rose-400/15 text-rose-100 border-rose-200/20',
  }
}

function Hearts({ count, max = 3 }) {
  const hearts = Array.from({ length: max }, (_, i) => (
    <span key={i} className="text-lg" style={{ opacity: i < count ? 1 : 0.28 }}>
      ❤️
    </span>
  ))

  return (
    <div className="flex gap-1.5">
      {hearts}
    </div>
  )
}

function CompactMeter({ label, value, maxValue, indicatorClassName, displayValue }) {
  const percent = maxValue > 0 ? Math.max(0, Math.min((value / maxValue) * 100, 100)) : 0

  return (
    <div className="w-26 space-y-1.5">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-white/88">
        <span>{label}</span>
        <span>{displayValue ?? `${value}/${maxValue}`}</span>
      </div>
      <Progress
        value={percent}
        className="h-2.5 rounded-full bg-[#5C4A27]/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]"
        indicatorClassName={indicatorClassName}
      />
    </div>
  )
}

function StatChip({ label, value, align = 'left' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 shadow-[0_8px_18px_rgba(10,19,40,0.16)] ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">{label}</p>
      <p className="mt-1 text-base text-white font-semibold">{value}</p>
    </div>
  )
}

function PetCard({ pet }) {
  const healthMeta = getHealthMeta(pet.healthPercent)

  return (
    <div className="px-6 pt-1 space-y-3">
      <div className="rounded-4xl overflow-hidden shadow-[0_14px_28px_rgba(0,0,0,0.2)] p-3">

        <div className="relative mx-auto overflow-hidden rounded-3xl " style={{ width: '336px', height: '192px' }}>
          <img src={beach}></img>
          <div className="absolute left-4 top-4 space-y-2.5">
            <div className="pb-0.5">
              <Hearts count={pet.hearts} max={pet.maxHearts} />
            </div>
          </div>

          <div className="absolute right-4 top-4 flex flex-col items-end gap-2.5">
            <span className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold shadow-[0_4px_12px_rgba(61,41,130,0.16)] ${healthMeta.badgeClassName}`}>
              {healthMeta.label}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-0 mt-10 flex items-center justify-center">
            <div className="relative h-24 w-24 rounded-3xl">
            <div className="absolute left-1/2 bottom-[-1.6rem] -translate-x-1/2 w-40 h-40 flex items-center justify-center">
                <img className="w-50 absolute" src={bowtie}></img>
                <img className="w-50" src={happyCat}></img>
                {/* TODO: toggle on and off if bowtie is purchased */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-white">
        <p className="text-[34px] leading-none font-semibold truncate jersey-font">{pet.name}</p>
        <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] text-white/90 self-end mb-1">Lv. {pet.level}</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <CompactMeter
          label="HP"
          value={pet.healthPercent}
          maxValue={100}
          displayValue={`${pet.healthPercent}%`}
          indicatorClassName="bg-linear-to-r from-pink-400 via-rose-400 to-fuchsia-500"
        />
        <CompactMeter
          label="EXP"
          value={pet.experienceInLevel}
          maxValue={pet.nextLevelExperience}
          indicatorClassName="bg-linear-to-r from-cyan-300 via-sky-300 to-indigo-300"
        />
      </div>
    </div>
  )
}

function CategoryItem({ category, onPress }) {
  const percent = category.budget > 0 ? Math.min((category.spent / category.budget) * 100, 100) : 0
  const isOver = category.budget > 0 && category.spent > category.budget

  return (
    <button
      onClick={() => onPress(category)}
      className="relative w-full rounded-2xl border border-white/15 bg-white/10 overflow-hidden text-left shadow-[0_8px_24px_rgba(5,8,25,0.22)] transition hover:bg-white/14 active:scale-[0.98]"
    >
      {/* progress fill */}
      <div
        className={`absolute inset-y-0 left-0 transition-all duration-500 ${
          isOver
            ? 'bg-linear-to-r from-rose-500/40 to-red-400/30'
            : 'bg-linear-to-r from-indigo-400/30 to-violet-400/20'
        }`}
        style={{ width: `${percent}%` }}
      />

      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-white font-semibold text-base leading-none">{toTitleCase(category.name)}</p>
          <p className="text-white/60 text-xs pt-1.5">
            {formatMoney(category.spent)}
            <span className="text-white/40"> / {formatMoney(category.budget)}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isOver
              ? 'bg-rose-400/15 text-rose-200 border-rose-300/25'
              : percent >= 80
              ? 'bg-amber-300/15 text-amber-100 border-amber-300/20'
              : 'bg-emerald-400/15 text-emerald-100 border-emerald-300/20'
          }`}>
            {Math.round(percent)}%
          </span>
        </div>
      </div>

      {/* thin progress bar at bottom */}
      <div className="relative h-0.5 w-full bg-white/8">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-500 ${
            isOver ? 'bg-rose-400' : 'bg-indigo-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  )
}

function PayPeriodExpenditure({ totals, payPeriodLabel }) {
  const overallPercent = totals.budget > 0 ? Math.min((totals.spent / totals.budget) * 100, 100) : 0
  const isOver = totals.budget > 0 && totals.spent > totals.budget

  return (
    <div className="px-6 pb-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white shadow-[0_8px_24px_rgba(5,8,25,0.22)]">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Pay Period</p>
            <p className="pt-1 text-[20px] leading-none font-semibold">Expenditure</p>
          </div>
          <span className="text-2xl">🧾</span>
        </div>

        <div className="flex items-end justify-between mb-2">
          <p className="text-xs text-white/65">
            {formatMoney(totals.spent)}
            {totals.budget > 0 && <span className="text-white/40"> / {formatMoney(totals.budget)}</span>}
          </p>
          {totals.budget > 0 && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isOver
                ? 'bg-rose-400/15 text-rose-200 border-rose-300/25'
                : 'bg-indigo-400/15 text-indigo-200 border-indigo-300/20'
            }`}>
              {Math.round(overallPercent)}% of budget
            </span>
          )}
        </div>

        {totals.budget > 0 && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOver
                  ? 'bg-linear-to-r from-rose-400 to-red-400'
                  : 'bg-linear-to-r from-indigo-400 to-violet-400'
              }`}
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        )}

        <p className="text-xs text-white/55 pt-2">
          You've spent {formatMoney(totals.spent)} this {payPeriodLabel}.
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [data, setData] = useState(INITIAL_STATE)
  const [totals, setTotals] = useState({ spent: 0, budget: 0 })
  const [payPeriodLabel, setPayPeriodLabel] = useState('pay period')
  const [userId, setUserId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadDashboard = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const [petProgress, categories, totalsResult, user] = await Promise.all([
        petApi.getProgress().catch(() => null),
        categoryApi.getAll().catch(() => []),
        categoryApi.getTotals().catch(() => null),
        userApi.getMe().catch(() => null),
      ])

      const mappedCategories = (categories || []).map((category) => ({
        id: category.category_id,
        name: category.name,
        spent: Number(category.expenditure ?? 0),
        budget: Number(category.upper_limit ?? 0),
      }))

      const totalBudget = Number(totalsResult?.total_upper_limit ?? 0)
      const totalSpent = Number(totalsResult?.total_expenditure ?? 0)
      const petExperience = Number(petProgress?.experience ?? 0)

      setData({
        pet: {
          name: user?.username ? `${user.username}'s pet` : 'Pet',
          hearts: petProgress?.hearts ?? 0,
          maxHearts: 3,
          healthPercent: petProgress?.health ?? 0,
          state: petProgress?.state ?? 'happy',
          level: petProgress?.level ?? 1,
          experience: petExperience,
          experienceInLevel: petExperience % 100,
          nextLevelExperience: 100,
        },
        categories: mappedCategories,
      })
      setTotals({ spent: totalSpent, budget: totalBudget })
      setUserId(user?.user_id || '')
      setPayPeriodLabel((user?.pay_period || 'pay period').toString().replaceAll('_', ' '))
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to load dashboard data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleAddCategory = async () => {
    if (!userId) {
      setErrorMessage('Please login again before adding categories.')
      return
    }

    const name = window.prompt('New category name (e.g. shopping):')
    if (!name || !name.trim()) {
      return
    }

    const upperLimitInput = window.prompt('Optional weekly budget for this category (e.g. 150):', '0')
    const upperLimit = Number(upperLimitInput)

    try {
      setErrorMessage('')
      await categoryApi.create({
        user_id: userId,
        name: name.trim(),
        upper_limit: Number.isFinite(upperLimit) ? upperLimit : 0,
        expenditure: 0,
        daily_expenses: 0,
      })
      await loadDashboard()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to create category'))
    }
  }

  return (
    <div className="flex flex-col gap-2 pb-3">
      {errorMessage && (
        <div className="mx-6 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-200">{errorMessage}</p>
        </div>
      )}
      {isLoading && (
        <div className="mx-6 rounded-xl border border-white/10 bg-white/6 px-3 py-2">
          <p className="text-xs text-white/60">Loading your dashboard…</p>
        </div>
      )}

      <PetCard pet={data.pet} />

      <div className="px-6 mt-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Tracking</p>
            <h2 className="pt-1 text-[20px] leading-none font-semibold text-white">Weekly Expenditure</h2>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white text-xl leading-none hover:bg-white/18 transition-colors"
            onClick={handleAddCategory}
            aria-label="Add category"
          >
            +
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.categories.map(cat => (
            <CategoryItem
              key={cat.id}
              category={cat}
              onPress={() => {}}
            />
          ))}

          {!isLoading && data.categories.length === 0 && (
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-5 text-center">
              <p className="text-sm text-white/65">No categories yet.</p>
              <p className="text-xs text-white/40 pt-1">Tap <span className="text-white/60">+</span> to add spending categories.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <PayPeriodExpenditure totals={totals} payPeriodLabel={payPeriodLabel} />
      </div>
    </div>
  )
}