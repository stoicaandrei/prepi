import { SignIn, useUser } from "@clerk/nextjs";

export default function SignInPage() {
  const { user } = useUser();

  if (!user) {
    return <SignIn />;
  }

  return <div>Welcome!</div>;
}
