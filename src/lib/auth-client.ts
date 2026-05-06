import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL is optional when auth server runs on the same domain
});

export const { signIn, signUp, signOut, useSession } = authClient;
