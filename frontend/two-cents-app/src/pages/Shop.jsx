import ShopItem from "@/components/ui/shopItem";
import example from "../assets/example.png";
import squeakyMouse from "../assets/mouseItem.gif";
import bowtie from "../assets/bowtieItem.png";
import canOfTuna from "../assets/canOfTuna.png";
import ballOfYarn from "../assets/ballOfYarn.png";
import { useEffect, useMemo, useState } from "react";
import { authApi, getApiErrorMessage, shopApi } from "@/api";


function Shop() {

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const featuredItems = [
    { name: "a can of tuna", src: canOfTuna,  desc: "a nice delicacy for your cat. doesn’t smell good though", price: 450, colour: "drop-shadow-[0_4px_6px_rgba(0,255,255,0.5)]", cosmetic: false },
    { name: "swat-a-fish", src: example, desc: "a cute fish on a string to play with. very, very distracting", price: 1000, colour: "drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]", cosmetic: false },
    { name: "catnip", src: example, desc: "drugs for your cat. a nice treat for a nice while!", price: 3200, colour: "drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]", cosmetic: false },
    { name: "bowtie", src: bowtie, desc: "a shiny pretty bow! comes with a bell.", price: 700, colour: "drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]", cosmetic: true },
    { name: "squeaky mouse", src: squeakyMouse, desc: "a plush mouse with a wiggly tail!", price: 1250, colour: "drop-shadow-[0_4px_6px_rgba(255,255,255,0.5)]", cosmetic: false},
    { name: "ball of yarn", src: ballOfYarn, desc: "string that unrolls until there’s no more ball left.", price: 300, colour: "drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]", cosmetic: false }
  ]

  const addItemCount = async (item) => {
    const shop = await getShopByUserId(userId);



    // if (item.cosmetic && ) {
      
    // }
  }

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

        for (const item of featuredItems) {
          await createShopItem({ shop_id: shop.shop_id, name: item.name, price_points: item.price, quantity: 1, cosmetic: item.cosmetic });
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

  // const availableItems = useMemo(() => {
  //   return featuredItems.map((featured) => {
  //     const shopItem = items.find(
  //       (item) =>
  //         item.name?.toLowerCase() === featured.name.toLowerCase()
  //     )
  
  //     return {
  //       ...featured,
  //       price: shopItem ? Number(shopItem.price_points || featured.price) : featured.price,
  //       desc: shopItem
  //         ? `Available: ${shopItem.quantity} • ${shopItem.cosmetic ? 'Cosmetic item' : 'Utility item'}`
  //         : featured.desc,
  //       quantity: shopItem?.quantity ?? 0
  //     }
  //   })
  // }, [items])

  

  const availableItems = useMemo(() => {
    return items.map((apiItem) => {
      const catalogItem = featuredItems.find(
        (f) => f.name.toLowerCase() === apiItem.name?.toLowerCase()
      )
  
      return {
        name: apiItem.name,
  
        // image from catalog
        src: catalogItem?.src || example,
  
        // description from catalog + api info
        desc: catalogItem
          ? `${catalogItem.desc} • Available: ${apiItem.quantity}`
          : `Available: ${apiItem.quantity}`,
  
        // price from API
        price: Number(apiItem.price_points || 0),
  
        // colour from catalog
        colour: catalogItem?.colour || 'drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]',
  
        quantity: apiItem.quantity,
        cosmetic: apiItem.cosmetic
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
          {availableItems.map((item) => (
            <ShopItem key={item.name} item={item}></ShopItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;