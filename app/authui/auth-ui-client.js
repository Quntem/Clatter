import { authClient, signIn, signOut, signUp, getSession } from "../auth-client.js"

window.authClient = authClient
const params = new URLSearchParams(document.location.search);
const redirurl = params.get("callback");

window.signin = function() {
    authClient.signIn.email({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }).then(res => {
        window.location.replace(redirurl)
    })
}