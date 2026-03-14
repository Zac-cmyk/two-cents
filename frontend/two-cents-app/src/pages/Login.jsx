
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Login() {
  return (
    <>
    <div className="w-full h-full bg-blue-100 flex items-centre justify-centre flex-col gap-6 p-6">

      <h1 className="text-3xl font-bold">2cents</h1>
      <h1 className="text-2xl font-bold">login here!</h1>


      <Field>
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter your username"
        />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="input-field-username">Password</FieldLabel>
        <Input
          id="input-field-password"
          type="text"
          placeholder="Password"
        />
      </Field>

    </div>
    </>
  )
}