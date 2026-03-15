
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleIcon from "@/assets/google.svg"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate();

  const googleLogin = async () => {
    await signInWithGoogle();
    navigate("/");
  }

  return (
    <>
    <div className="w-full h-full border flex items-centre justify-centre flex-col gap-5 p-12 bg-[#2b2753] text-white">

      <div className="my-4">
        <h1 className="text-3xl font-bold text-[#e2d799]">2cents</h1>
      </div>

      <h1 className="text-2xl font-bold">welcome back, login here!</h1>

    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
        <Input
          id="input-field-email"
          type="text"
          placeholder="Enter your email"
        />
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

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <Button className="w-full bg-black/50 text-white shadow hover:cursor-pointer">Log into Account</Button>
        <p>or</p>
        <Button className="w-full bg-none outline bg-black/50 shadow hover:cursor-pointer" onClick={googleLogin}>
        <img src={GoogleIcon} alt="Google logo" className="w-4 h-4" />
          Continue with Google
        </Button>

        <span className="text-xs">don't have an account yet? <a className="hover:underline" href="/signup">sign up!</a></span>
      </div>
    
    </div>
    </>
  )
}