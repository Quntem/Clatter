import { showDialog } from "./dialog.js"
import { deleteMessage, getChannels } from "../src/clatterAPI.js"

class qclheader extends HTMLElement {
    // static observedAttributes = ["headertitle"]
    constructor() {
        super()
    }
    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name == "headertitle") {
    //         this.querySelector(".headertitletext").textContent = newValue
    //     }
    // }
    connectedCallback() {
        var title = this.getAttribute("headertitle")
        if (this.getAttribute("main") == "true") {
            this.innerHTML = `
                <i class="icon-panel-left layout-header-left sidebar-toggle-button"></i>
                <div class="headertitletext" id="headertitletext">${title}</div>
                <!-- <i class="icon-panel-right layout-header-right"></i> -->
            `
        } else {
            this.innerHTML = `
                <div class="headertitletext" id="headertitletext">${title}</div>
                <!--<i class="icon-x layout-header-right"></i>-->
            `
        }
        if(this.getAttribute("hasAddButton") == "true") {
            this.innerHTML += `
                <i class="icon-plus add-button layout-header-right"></i>
            `
        }
        this.addEventListener("click", (event) => {
            event.stopPropagation()
        })
        this.querySelector(".sidebar-toggle-button").addEventListener("click", () => {
            if (document.getElementById("sidebar").getAttribute("closed") == "true") {
                document.getElementById("sidebar").setAttribute("closed", "false")
                if(innerWidth < 768) {
                    document.getElementById("mainarea").style.opacity = 0.5
                }
            } else {
                document.getElementById("sidebar").setAttribute("closed", "true")
                if(innerWidth < 768) {
                    document.getElementById("mainarea").style.opacity = 1
                }
            }
        })
    }
}

window.customElements.define("qcl-header", qclheader)

class sidebarItem extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        if (this.getAttribute("type") == "channel") {
            this.innerHTML = `
                <i class="icon-hash"></i>
                <div class="headertitletext">${this.getAttribute("channeltitle")}</div>
            `
        } else if (this.getAttribute("type") == "customicon") {
            this.innerHTML = `
                <i class="icon-${this.getAttribute("icon")}"></i>
                <div class="headertitletext">${this.getAttribute("channeltitle")}</div>
            `
        } else if (this.getAttribute("type") == "imageicon") {
            this.innerHTML = `
                <img class="sidebar-imgicon" src="${this.getAttribute("icon")}">
                <div class="headertitletext">${this.getAttribute("channeltitle")}</div>
            `
        }
    }
}

window.customElements.define("clatter-sidebar-item", sidebarItem)

class sidebarSection extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        var items = this.innerHTML
        this.innerHTML = ""
        if (this.getAttribute("collapsable") == "true") {
            var collapseicon = `<i class="icon-chevron-down sidebar-section-collapse"></i>`
        } else {
            var collapseicon = ""
        }
        if (this.getAttribute("name") != undefined) {
            $(this).append(`<div class="sidebar-section-header"><div>${this.getAttribute("name")}</div>${collapseicon}</div>`)
        }
        $(this).append(`
            <div class="sidebar-section-content">${items}</div>
        `)
    }
}

window.customElements.define("clatter-sidebar-section", sidebarSection)

class directoryItem extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
            <img class="dir-entry-avatar" src="${this.getAttribute("avatar")}">
            <div class="dir-entry-name">${this.getAttribute("name")}</div>
            <div class="dir-entry-email">${this.getAttribute("email")}</div>
        `
    }
}

window.customElements.define("clatter-directory-item", directoryItem)

class QCMessage extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        if (this.getAttribute("avatar") == undefined) {
            var oldcontent = this.innerHTML
            this.innerHTML = `
                <div style="min-width: 39px; max-width: 39px; height: 1px;"></div>
                <div class="message-layoutstack">
                    <div class="message-content">${oldcontent}</div>
                </div>
            `
        } else { 
            var oldcontent = this.innerHTML
            this.innerHTML = `
                <img class="message-avatar" src="${this.getAttribute("avatar")}">
                <div class="message-layoutstack">
                    <div class="message-username">${this.getAttribute("username")}</div>
                    <div class="message-content">${oldcontent}</div>
                </div>
            `
        }

        if(this.getAttribute("isthread") == "true") {
            if(this.getAttribute("replymode") == "direct") {
                console.log(this.getAttribute("parentmessageid"))
                var replymessage = await window.currentChat.getMessage(this.getAttribute("parentmessageid"))
                console.log(replymessage)
                var oldcontent = this.innerHTML
                this.innerHTML = `
                    <div>
                        <div class="original-message-row">
                            <i class="icon-reply"></i>
                            <img class="original-message-icon">
                            <div class="original-message-text"></div>
                        </div>
                        <div class="reply-message-row">
                            ` + oldcontent + `
                        </div>
                    </div>
                `
                this.querySelector(".original-message-icon").setAttribute("src", window.fullorg.data.members.find(item => item.user.id == replymessage.sender).user.image)
                this.querySelector(".original-message-text").innerText = replymessage.content
            } else {
                var showthreadbutton = document.createElement("div")
                showthreadbutton.innerText = "Show Thread"
                showthreadbutton.classList.add("message-show-thread-button")
                this.querySelector(".message-layoutstack").appendChild(showthreadbutton)
                showthreadbutton.addEventListener("click", () => {
                    window.history.pushState(null, null, "/starship/channel/" + window.location.pathname.split("/")[3] + "/thread/" + this.getAttribute("id"))
                    updateViewLocation()
                })
            }
        }

        this.appendChild(document.createElement("clatter-message-actionbar"))

        if(window.location.pathname.split("/")[4] != "thread") {
            var replybutton = document.createElement("i")
            replybutton.classList.add("icon-message-circle-reply")
            replybutton.classList.add("reply-button")
            this.querySelector("clatter-message-actionbar").appendChild(replybutton)
            if (this.getAttribute("replymode") == "direct") {
                this.querySelector(".reply-button").addEventListener("click", () => {
                    window.currentChat.isreplying = true
                    window.currentChat.replymessage = this.getAttribute("id")
                })
            } else {
                this.querySelector(".reply-button").addEventListener("click", () => {
                    window.history.pushState(null, null, "/starship/channel/" + window.location.pathname.split("/")[3] + "/thread/" + this.getAttribute("id"))
                    updateViewLocation()
                })
            }
        }
        if(this.getAttribute("senderid") == authsession.data.user.id) {
            var deletebutton = document.createElement("i")
            deletebutton.classList.add("icon-trash")
            deletebutton.classList.add("delete-message-button")
            this.querySelector("clatter-message-actionbar").appendChild(deletebutton)
            this.querySelector(".delete-message-button").addEventListener("click", () => {
                showDialog({
                    title: "Delete Message",
                    content: "Are you sure you want to delete this message?",
                    type: "confirm"
                }).then(async () => {
                    await deleteMessage(window.location.pathname.split("/")[3], this.getAttribute("id"))
                    this.remove()
                })
            })
        }
        if(window.location.pathname.split("/")[4] == "thread" && this.getAttribute("senderid") != authsession.data.user.id) {
            this.querySelector("clatter-message-actionbar").remove()
        }
    }
}

window.customElements.define("clatter-message", QCMessage)

// document.querySelector(".sidebar-header-button").addEventListener("click", () => {
//     showDialog({
//         title: "Compose Message",
//         content: "",
//         type: "confirm"
//     }).then(async () => {
//         var channels = await getChannels()
//         channels.filter((channel) => {
//             return channel.name.toLowerCase().includes(window.composerChannel.toLowerCase())
//         })
//         if(channels.length == 0) {
//             showDialog({
//                 title: "Channel Not Found",
//                 content: "Channel not found",
//                 type: "confirm"
//             })
//             return
//         }
//         window.history.pushState(null, null, "/starship/channel/" + channels[0].id)
//         updateViewLocation()
//         setTimeout(() => {
//             // document.querySelector("#mainview").querySelector(".messageinput").value = window.composerInput
//             window.currentChat.sendMessage(window.composerInput)
//         }, 500)
//     })
//     setTimeout(async () => {
//         $(document.querySelector(".dialog-body")).prepend (`
//             <div class="compose-message-container">
//                 <input type="text" autocomplete="off" placeholder="Channel Name" id="compose-message-channelname">
//                 <textarea autocomplete="off" placeholder="Message" id="compose-message-input"></textarea>
//             </div>
//         `)
//         var channels = await getChannels()
//         channels = channels.map((channel) => {
//             return channel.name
//         })
//         const autoCompleteJS = new autoComplete({
//             placeHolder: "Channel Name",
//             data: {
//                 src: channels
//             },
//             resultItem: {
//                 highlight: true,
//             },
//             selector: "#compose-message-channelname"
//         })
//         autoCompleteJS.start()
//         document.querySelector("#compose-message-channelname").addEventListener("selection", (event) => {
//             document.querySelector("#compose-message-channelname").value = event.detail.selection.value
//             window.composerChannel = event.detail.selection.value
//         })
//         document.querySelector("#compose-message-input").addEventListener("input", (event) => {
//             window.composerInput = event.target.value
//         })
//     }, 100)
// })

document.querySelector(".sidebar-header-button").addEventListener("click", () => {
    window.history.pushState(null, null, "/starship/compose")
    updateViewLocation()
})