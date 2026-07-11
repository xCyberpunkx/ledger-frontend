import { SignIn } from "@clerk/nextjs";

// The [[...sign-in]] folder name is Clerk's required catch-all route —
// Clerk's hosted flow needs to handle sub-paths like /sign-in/factor-two
// for 2FA, so it owns everything under this route, not just the exact path.
export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft">
      <SignIn />
    </main>
  );
}
