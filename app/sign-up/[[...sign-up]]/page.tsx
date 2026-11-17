import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthFrame } from "../../_auth/AuthFrame";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <AuthFrame>
      <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/" />
    </AuthFrame>
  );
}
