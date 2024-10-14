import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn fallbackRedirectUrl="/auth/post-sign-in" />;
}
