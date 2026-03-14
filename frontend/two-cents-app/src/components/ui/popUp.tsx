import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"


type PopUpProps = {
  item : {
    name: string;
    src: string;
    desc: string;
    price: number;
  }
};

export function PopUp({item} : PopUpProps) {
  const [ popUp, setPopUp ] = useState(false);

  const triggerPopup = () => {

  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <img onClick={triggerPopup}
          src={item.src} className="w-16 object-contain py-2 hover:shadow hover:scale-110 hover:cursor-pointer drop-shadow-[0_4px_6px_rgba(255,0,0,0.5)]" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm bg-white/90 drop-shadow-[0_4px_6px_rgba(255,255,255,0.5)] border-0 outline-none">
          <DialogHeader>
            <DialogTitle>buy {item.name}</DialogTitle>
            <DialogDescription>
              {item.desc}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Number of items:</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={1}
                min={1}
                max={99}
                placeholder="Numbers only!"
              />
              </Field>
              <FieldDescription>Your total price is</FieldDescription>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
