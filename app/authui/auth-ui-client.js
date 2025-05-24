import { authClient, signIn, signOut, signUp, getSession } from "../auth-client.js"
import DOMPurify from 'dompurify';

window.authClient = authClient
const params = new URLSearchParams(document.location.search);
let redirurl = params.get("callback");
redirurl = DOMPurify.sanitize(redirurl);
let emailFromParams = params.get("email");
emailFromParams = DOMPurify.sanitize(emailFromParams);

if (emailFromParams) {
    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.value = emailFromParams;
    }
}

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

window.ResetPassword = async function() {
    window.fpoutput = await authClient.forgetPassword({
        email: document.getElementById("email").value,
        redirectTo: "/authui/reset-password",
    });

    console.log(window.fpoutput)
}

window.ResetPasswordFinish = async function() {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
        window.location.replace("/authui/resetpassword")
    }
    window.fpoutput = await authClient.resetPassword({
        newPassword: document.getElementById("password").value,
        token,
    });
    window.location.replace("/client/")
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