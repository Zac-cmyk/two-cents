
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleIcon from "@/assets/google.svg"
import logo from "../assets/logo.gif"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { authApi, getApiErrorMessage } from "@/api"

export default function Login() {
  const [ identifier, setIdentifier] = useState("")
  const [ password, setPassword] = useState("")
  const [ isSubmitting, setIsSubmitting] = useState(false)
  const [ errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate();

  const googleLogin = async () => {
    await signInWithGoogle();
    navigate("/home");
  }

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both username/email and password')
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      await authApi.login({
        identifier: identifier.trim(),
        password,
      })
      navigate("/home")
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Login failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <div className="w-full h-full border flex items-centre justify-centre flex-col gap-5 p-12 bg-[#2b2753] text-white">

      <div className="w-20">
        <img src={logo}></img>
      </div>

      <h1 className="text-2xl font-bold">welcome back, login here!</h1>

    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="input-field-email">Email or Username</FieldLabel>
        <Input
          id="input-field-email"
          type="text"
          placeholder="Enter your email or username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="input-field-username">Password</FieldLabel>
        <Input
          id="input-field-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
    </div>

      {errorMessage && <p className="text-xs text-red-300 text-center">{errorMessage}</p>}

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <Button
          className="w-full bg-black/50 text-white shadow hover:cursor-pointer"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log into Account'}
        </Button>
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