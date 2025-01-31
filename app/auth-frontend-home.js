import { authClient, signIn, signOut, signUp, getSession } from "./auth-client.js"

window.authClient = authClient

authClient.getSession().then((res) => {
    window.authsession = res
    if (res.data != null) {
        window.location.replace("/client/")
    }
})

window.auth = {
    
}

loadfunction()