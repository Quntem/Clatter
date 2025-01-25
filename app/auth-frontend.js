import { authClient, signIn, signOut, signUp, getSession } from "./auth-client.js"

window.authClient = authClient

authClient.getSession().then((res) => {
    document.getElementById("header-userbutton").setAttribute("title", res.data.user.email)
})

window.auth = {
    
}