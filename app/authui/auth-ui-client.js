import { authClient, signIn, signOut, signUp, getSession } from "../auth-client.js"
import DOMPurify from 'dompurify';

window.authClient = authClient
const params = new URLSearchParams(document.location.search);
let redirurl = params.get("callback");
redirurl = DOMPurify.sanitize(redirurl);
let emailFromParams = params.get("email");
emailFromParams = DOMPurify.sanitize(emailFromParams);

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await getSession();
        const session = result.data?.session;
        const pathname = window.location.pathname || "";

        if (session && !pathname.endsWith("createworkspace.html")) {
            window.location.replace("/client/");
            return;
        }
    } catch (err) {
        console.warn("Error checking session:", err);
    }
});


if (emailFromParams) {
    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.value = emailFromParams;
    }
}

window.signin = function(button) {
    const errorBox = document.getElementById("errorBox");
    errorBox.textContent = "";
    errorBox.style.display = "none";

    button.innerHTML = "Signing in… <div class='icon-loader-circle loader-circle-animation' style='margin-left:0.25rem;'></div>";

    authClient.signIn.email({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }).then(res => {
        if (res.error) {
            errorBox.textContent = res.error.message;
            errorBox.style.display = "block";
            button.innerHTML = "Sign In";
            return;
        }
        window.location.replace(redirurl);
    }).catch(err => {
        errorBox.textContent = err.message;
        errorBox.style.display = "block";
        button.innerHTML = "Sign In";
    });
};


window.signup = function(button) {
    const errorBox = document.getElementById("errorBox");
    errorBox.textContent = "";
    errorBox.style.display = "none";

    button.innerHTML = "Signing up… <div class='icon-loader-circle loader-circle-animation' style='margin-left:0.25rem;'></div>";

    authClient.signUp.email({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
    }).then(res => {
        if (res.error) {
            errorBox.textContent = res.error.message;
            errorBox.style.display = "block";
            button.innerHTML = "Sign Up";
            return;
        }
        window.location.replace(redirurl);
    }).catch(err => {
        errorBox.textContent = err.message;
        errorBox.style.display = "block";
        button.innerHTML = "Sign Up";
    });
};

window.ResetPassword = async function() {
    window.fpoutput = await authClient.forgetPassword({
        email: document.getElementById("email").value,
        redirectTo: "/authui/resetpassword",
    });

    console.log(window.fpoutput);
    window.location.replace("/authui/success");
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