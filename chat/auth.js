window.addEventListener('load', async function () {
    await Clerk.load()

    if (Clerk.user) {
        const userButtonDiv = document.getElementById('user-button')

        Clerk.mountUserButton(userButtonDiv)
    } else {
        Clerk.redirectToSignIn()
    }
})