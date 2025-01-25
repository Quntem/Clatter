import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const { signIn, signUp, signOut, getSession } = authClient;