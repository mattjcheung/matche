import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthFrame } from "../../_auth/AuthFrame";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthFrame>
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/home" />
    </AuthFrame>
  );
}
