import { betterAuth } from "better-auth";
import { openAPI, organization, oidcProvider, multiSession, } from "better-auth/plugins"
import pg from "pg"
var { Pool } = pg
// import Database from "better-sqlite3"

// database: new Database("./users.db"),
 
export const auth = betterAuth({
    database: new Pool({
        connectionString: "postgres://postgres:password@db:5432/auth",
    }),
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