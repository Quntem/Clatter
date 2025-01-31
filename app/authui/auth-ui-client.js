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

window.signup = function() {
    authClient.signUp.email({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
    }).then(res => {
        window.location.replace(redirurl)
    })
}

window.createworkspace = function() {
    if (document.getElementById("imgurl").value == "") {
        window.icon = "/assets/DWSI.png"
    } else {
        window.icon = document.getElementById("imgurl").value
    }
    authClient.organization.create({
        name: document.getElementById("name").value,
        slug: document.getElementById("slug").value,
        logo: icon
    }).then(res => {
        window.location.replace(redirurl)
    })
}

pagefunction()