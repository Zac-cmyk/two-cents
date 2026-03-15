import ShopItem from "@/components/ui/shopItem";
import example from "../assets/example.png";


function Shop() {

  const featuredItems = [
    { name: "a can of tuna", src: example,  desc: "a nice delicacy for your cat. doesn’t smell good though", price: 4.50 },
    { name: "swat-a-fish", src: example, desc: "a cute fish on a string to play with. very, very distracting", price: 10.00 },
    { name: "catnip", src: example, desc: "drugs for your cat. a nice treat for a nice while!", price: 32.00 },
    { name: "bowtie", src: example, desc: "a shiny pretty bow to tie!", price: 7.00 },
    { name: "squeaky mouse", src: example, desc: "a plush mouse that makes a noise when it gets bitten.", price: 12.50 },
    { name: "ball of yarn", src: example, desc: "string that unrolls until there’s no more ball left.", price: 3.00 }

  ]

  return (
    <div className="px-5 text-white">
      <div className="flex flex-col items-center">
        <div className="w-92 h-40 border rounded-md">image here</div>
      </div>
      <div className="">
        <h1 className="text-xl font-semibold px-2 py-4">Featured Items</h1>
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