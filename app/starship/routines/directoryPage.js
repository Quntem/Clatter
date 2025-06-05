import { showDialog } from "../components/dialog.js"
import { getDirectory, addMember, removeMember } from "../src/clatterAPI.js"

window.loaddir = () => {
    getDirectory().then((res) => {
        document.querySelector(".grid-container").innerHTML = ""
        res.forEach((item) => {
            var newitem = document.createElement("clatter-directory-item")
            newitem.setAttribute("avatar", item.user.image)
            newitem.setAttribute("name", item.user.name)
            newitem.setAttribute("email", item.user.email)
            document.querySelector(".grid-container").appendChild(newitem)
            newitem.addEventListener("click", () => {
                showDialog({
                    title: "Remove Member",
                    content: "Are you sure you want to remove this member?",
                    type: "confirm"
                }).then(() => {
                    removeMember(item.user.id)
                    window.loaddir()
                })
            })
        })
    })
}

window.loaddireventlistener = function() {
    document.querySelector(".add-button").addEventListener("click", () => {
        showDialog({
            title: "Add Member",
            content: "",
            type: "confirm"
        }).then(async () => {
            await addMember(window.addmemberuserid)
            window.loaddir()
        })
        setTimeout(() => {
            var input = document.createElement("input")
            input.setAttribute("type", "text")
            input.setAttribute("placeholder", "UserID")
            document.querySelector(".dialog-body").prepend(input)
            input.addEventListener("input", () => {
                window.addmemberuserid = input.value
            })
        }, 50)
    })
}