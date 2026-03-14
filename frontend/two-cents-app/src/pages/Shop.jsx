import ShopItem from "@/components/ui/shopItem";
import example from "../assets/example.png";


function Shop() {

  featuredItems = {
    name: "a can of tuna", src: example, desc: "a nice delicacy for your cat. doesn’t smell good though",
    name: "swat-a-fish", src: example, desc: "a cute fish on a string to play with. very very distracting",
    name: "catnip", src: example, desc: "drugs for your cat. a nice treat for a nice while!",
    name: "bowtie", src: example, desc: "a shiny pretty bow for your cat!",
    name: "squeaky mouse", src: example, desc: "a plush mouse that makes a noise when it gets bitten. the tail moves",
    name: "ball of yarn", src: example, desc: "string that unrolls bit by bit, along the floor until there’s no more ball left",

  }
  return (
    <div className="px-5 text-white">
      <div className="flex flex-col items-center">
        <div className="w-92 h-50 border rounded-md">image here</div>
      </div>
      <div className="flex">
        <h1 className="text-xl font-semibold px-2 py-4">Featured Items</h1>
        {featuredItems.map(item => (
          <ShopItem></ShopItem>
        ))}

      </div>
    </div>
  );
}

export default Shop;