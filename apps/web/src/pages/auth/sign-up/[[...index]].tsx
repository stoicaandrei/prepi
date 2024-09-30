import { SignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  const { user } = useUser();

  if (!user) {
    return <SignUp />;
  }

  return <div>Welcome!</div>;
}
