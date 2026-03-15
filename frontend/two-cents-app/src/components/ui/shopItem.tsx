import { useState } from "react";
import { PopUp } from "./popUp";

type ShopItemProps = {
  item : {
    name: string;
    src: string;
    desc: string;
    price: number;
    colour: string;
  }
};
export default function ShopItem({ item } : ShopItemProps) {


  return (
    <article className="w-[30%] h-30 flex flex-col">
      <div className=" flex items-center flex-col">
        <PopUp item={item}></PopUp>
      </div>
        <span className="text-[7px]">${item.price.toFixed(2)}</span>
      <div className="pl2">
        <h2 className="text-xs">{item.name}</h2>
        <div className="flex items-center gap-1 text-[7px]">
          <span>{item.desc}</span>
        </div>
      </div>
    </article>
  )
}