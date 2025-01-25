import { createAuthClient } from "better-auth/client"
import { multiSessionClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        multiSessionClient(),
        organizationClient()
    ]
})

export const { signIn, signUp, signOut, getSession } = authClient;