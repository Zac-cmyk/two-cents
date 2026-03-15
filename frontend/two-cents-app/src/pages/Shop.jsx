import ShopItem from "@/components/ui/shopItem";
import example from "../assets/example.png";
import squeakyMouse from "../assets/mouse.gif";
import { useEffect, useMemo, useState } from "react";
import { authApi, getApiErrorMessage, shopApi } from "@/api";


function Shop() {

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadShop = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const authState = await authApi.me()
        const userId = authState?.user?.user_id

        if (!userId) {
          throw new Error('Please log in to load shop items')
        }

        let shop
        try {
          shop = await shopApi.getByUserId(userId)
        } catch {
          shop = await shopApi.createForUser(userId)
        }

        const result = await shopApi.getItemsByShopId(shop.shop_id)
        setItems(result || [])
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Failed to load shop'))
      } finally {
        setIsLoading(false)
      }
    }

    loadShop()
  }, [])

  const featuredItems = useMemo(() => {
    return items.map((item) => {
      const normalizedName = item.name?.toLowerCase?.() || ''
      const isMouse = normalizedName.includes('mouse')

      return {
        name: item.name,
        src: isMouse ? squeakyMouse : example,
        desc: `Available: ${item.quantity} • ${item.cosmetic ? 'Cosmetic item' : 'Utility item'}`,
        price: Number(item.price_points || 0),
        colour: isMouse
          ? 'drop-shadow-[0_4px_6px_rgba(255,255,255,0.5)]'
          : 'drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]',
      }
    })
  }, [items])

  return (
    <div className="px-5 text-white">
      <div className="flex flex-col items-center">
        <div className="w-92 h-40 border rounded-md">image here</div>
      </div>
      <div className="">
        <h1 className="text-xl font-semibold px-2 py-4">Featured Items</h1>
        {isLoading && <p className="text-sm pb-4">Loading shop...</p>}
        {errorMessage && <p className="text-sm pb-4 text-red-300">{errorMessage}</p>}
        <div className="w-full flex flex-wrap gap-3 justify-between">
          {featuredItems.map((item) => (
            <ShopItem key={item.name} item={item}></ShopItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;