// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

const MOCK_DATA = {
  pet: { name: 'skinny', hearts: 3, maxHearts: 4, healthPercent: 60 },
  categories: [
    { id: 1, name: 'food and drinks', spent: 250, budget: 500 },
    { id: 2, name: 'entertainment', spent: 80, budget: 100 },
    { id: 3, name: 'transport', spent: 120, budget: 200 },
    { id: 4, name: 'miscellaneous', spent: 5, budget: 40 },
  ]
}

function Hearts({ count }) {
  const hearts = Array.from({ length: 3 }, (_, i) => (
    <span key={i} style={{ opacity: i < count ? 1 : 0.3 }}>
      ❤️
    </span>
  ));

  return (
    <div className="flex gap-1">
      {hearts}
    </div>
  )
}

function PetCard({ pet }) {
  return (
    <div className="mx-8">
      <div className=" bg-[#2a2a5e] rounded-2xl overflow-hidden">
        <div className="relative bg-[#3a3a7e] h-48 flex items-center justify-center">
          <div className="absolute top-3 left-3 flex flex-col gap-2"> 
            <Hearts count={pet.hearts} max={pet.maxHearts} />
            <Progress
              value={pet.healthPercent}
              className="w-24"
            />    
          </div>
        </div>
      </div>
      <p className="text-white text-center py-3 font-semibold">{pet.name}</p>
    </div>
  )
}

function CategoryItem({ category, onPress }) {
  const percent = Math.min((category.spent / category.budget) * 100, 100)

  return (
    <button
      onClick={() => onPress(category)}
      className="relative w-full bg-[#d9d9d9] py-1 px-4 flex justify-between items-center text-left"
    >
      <div
        className="absolute inset-y-0 left-0 bg-[#e1d799]"
        style={{ width: `${percent}%` }}
      />

      <div className="relative z-10">
        <p className="text-black font-bold text-m">{category.name}</p>
        <p className="text-black text-xs">${category.spent} out of ${category.budget}</p>
      </div>
      <span className="text-black text-lg">···</span>
    </button>
  )
}

function WeeklySavings({ category }) {
  return (
    <div className="px-8">
      <p className="text-white font-bold text-xl text-right mt-5 pb-1">Weekly Savings</p>
      <p className="text-white text-xs text-right">congrats! you've saved ___ this week</p>
      <div className="flex justify-center text-center text-white w-full my-4">
        money falling? <br/>
        some image is going here idk man
      </div>

    </div>
  )
}

export default function Home() {
  const [data, setData] = useState(MOCK_DATA); // fix this later 
  const navigate = useNavigate()

  useEffect(() => {
    // get data in here through backend call 
  }, [])

  function handleCategoryPress(category) { // fix this later
    navigate(`/home/${category.id}`, { state: { category } })
  }

  return (
    <div className="flex flex-col mb-4 gap-4">
      <PetCard pet={data.pet} />

      <div className="px-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-bold text-xl">Weekly Expenditure</h2>
          <button className="text-white text-2xl leading-none">+</button>
        </div>

        <div className="flex flex-col gap-3">
          {data.categories.map(cat => (
            <CategoryItem
              key={cat.id}
              category={cat}
              onPress={handleCategoryPress}
            />
          ))}
        </div>
      </div>

      <WeeklySavings />
    </div>
  )
}