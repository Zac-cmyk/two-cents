import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User signed in:", user.displayName, user.email);
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};