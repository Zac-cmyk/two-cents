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


type PopUpProps = {
  item : {
    name: string;
    src: string;
    desc: string;
    price: number;
    colour: string; 
  }
};

export function PopUp({item} : PopUpProps) {


  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <img
          src={item.src} className={`w-16 object-contain py-2 hover:scale-110 hover:cursor-pointer ${item.colour}`}/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm bg-white/90 drop-shadow-[0_4px_6px_rgba(255,255,255,0.5)]">
          <DialogHeader>
            <DialogTitle>buy {item.name}</DialogTitle>
            <DialogDescription>
              {item.desc}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">number of items available: (1)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={1}
                min={1}
                max={10}
                placeholder="max 10 items can be purchased at one time!"
              />
              </Field>
              <FieldDescription>your total price is</FieldDescription>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Buy</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
