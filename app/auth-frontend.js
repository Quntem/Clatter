import { authClient, signIn, signOut, signUp, getSession } from "./auth-client.js"

window.authClient = authClient

authClient.getSession().then((res) => {
    if (res.data == null) {
        window.location.replace("/authui/index.html?callback=" + window.location.toString())
    } else {
        document.getElementById("header-userbutton").setAttribute("title", res.data.user.email)
    }
})

window.auth = {
    
}