import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();
  return { user: session?.user };
}
