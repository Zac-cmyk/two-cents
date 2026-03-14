import example from "../../assets/example.png";

export default function ShopItem({name, src, price}) {
  return (
    <article className="w-[30%] h-30 flex justify-center items-center flex-col">
      <img src={example} className="w-16 object-contain py-2" />
      <h2>a can of tuna</h2>
      <p className="text-[8px]">this is a placeholder and i'm checking how long the box is.</p>
    </article>
  )
}