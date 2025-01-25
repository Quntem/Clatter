import { betterAuth } from "better-auth";
import { openAPI, organization, oidcProvider, multiSession, } from "better-auth/plugins"
import Database from "better-sqlite3"

 
export const auth = betterAuth({
    database: new Database("./users.db"),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [ 
        openAPI(),
        oidcProvider(),
        organization(),
        multiSession()
    ] 
})