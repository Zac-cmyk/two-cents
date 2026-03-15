
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleIcon from "@/assets/google.svg"

import { Button } from "@/components/ui/button"
import { useState } from "react";
import { signInWithGoogle } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { authApi, getApiErrorMessage } from "@/api";

import logo from "../assets/logo.gif"

export default function SignUp() {

  const [ username, setUsername ] = useState("");
  const [ moveOn, setMoveOn ] = useState(false);
  const [ email, setEmail] = useState("")
  const [ password, setPassword] = useState("")
  const [ errorMessage, setErrorMessage] = useState("")
  const [ isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate();

  const movingOn = () => {
    // todo: validate username
    if (username.trim() === "") {
      setErrorMessage('Username is required')
      return false;
    }
    setErrorMessage("")
    setMoveOn(true)
  }

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      setErrorMessage('Username, email and password are required')
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      await authApi.register({
        email: email.trim(),
        username: username.trim(),
        name: username.trim(),
        password,
      })
      navigate('/home')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Registration failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const googleLogin = async () => {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const { idToken } = await signInWithGoogle();
      await authApi.googleLogin({ idToken })
      navigate('/home')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Google login failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <div className="w-full h-full border flex items-centre justify-centre flex-col gap-5 p-12 bg-[#2b2753] text-white">

    <div className="w-20">
      <img src={logo} ></img>
    </div>

      <h1 className="text-2xl font-bold">create an account!</h1>

      {errorMessage && <p className="text-xs text-red-300">{errorMessage}</p>}

    { moveOn ?
     <>
     <div className="flex flex-col gap-6">
       <Field>
         <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
         <Input
           id="input-field-email"
           type="text"
           placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
         />
       </Field>


       <Field>
         <FieldLabel htmlFor="input-field-password">Password</FieldLabel>
         <Input
           id="input-field-password"
           type="password"
           placeholder="Password"
           value={password}
           onChange={(event) => setPassword(event.target.value)}
         />
       </Field>
     </div>

       <div className="w-full flex flex-col items-center justify-center gap-4">
         <Button
          className="w-full bg-black/50 text-white shadow hover:cursor-pointer"
          onClick={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
         <p>or</p>
         <Button className="w-full bg-none outline bg-black/50 shadow hover:cursor-pointer" onClick={googleLogin}>
         <img src={GoogleIcon} alt="Google logo" className="w-4 h-4" />
           Continue with Google
         </Button>

         <span className="text-xs">already have an account yet? <a className="hover:underline" href="/">log in!</a></span>
     </div>
    </>

     : 
      <>
      <Field className="flex flex-col gap-3">
        <p>What should we call you?</p>
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <FieldDescription>Username must be unique!</FieldDescription>
        <div className="w-full flex justify-end">
          <Button className="bg-black/50 text-white shadow hover:cursor-pointer px-5" onClick={movingOn}>Next</Button>
        </div>
      </Field>
      </>
     }
    
    </div>
    </>
  )
}