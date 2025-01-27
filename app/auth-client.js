import { createAuthClient } from "better-auth/client"
import { multiSessionClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/auth",
    plugins: [
        multiSessionClient(),
        organizationClient()
    ]
})

console.log(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/auth")

export const { signIn, signUp, signOut, getSession } = authClient;