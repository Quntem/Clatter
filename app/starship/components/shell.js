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
        if(this.getAttribute("hasMeetingButton") == "true") {
            this.innerHTML += `
                <i class="icon-video meeting-button layout-header-right"></i>
            `
        }
        this.addEventListener("click", (event) => {
            event.stopPropagation()
        })
        this.querySelector(".meeting-button").addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/meeting/" + window.location.pathname.split("/")[3])
            updateViewLocation()
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

class ToggleButton extends HTMLElement {
    static observedAttributes = ["checked"]
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
            <label class="switch">
                <input type="checkbox">
                <span class="slider"></span>
            </label>
        `
        this.querySelector("input").checked = this.getAttribute("checked") == "true"
        this.querySelector("input").addEventListener("change", (event) => {
            this.dispatchEvent(new CustomEvent("change", {
                detail: {
                    checked: event.target.checked
                }
            }))
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "checked") {
            this.querySelector("input").checked = newValue == "true"
        }
    }
}

window.customElements.define("toggle-button", ToggleButton)

class MeetingFinishedPage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.reason = this.getAttribute("reason")
        if(this.reason == undefined) {
            this.reason = "You have left the meeting"
        }
        this.innerHTML = `
            <i class="icon-video-off"></i>
            <h1>Meeting Left</h1>
            <p>${this.reason}</p>
            <div class="meeting-finished-page-button-row">
                <button class="meeting-finished-page-button meeting-finished-page-button-meeting-list">Meeting List</button>
                <button class="meeting-finished-page-button meeting-finished-page-button-go-to-channel">Go To Channel</button>
                <button class="meeting-finished-page-button meeting-finished-page-button-rejoin-meeting">Rejoin Meeting</button>
            </div>
        `
        this.querySelector("i").style.fontSize = "100px"
        this.querySelector("i").style.color = "var(--foreground-color)"
        this.querySelector("h1").style.color = "var(--foreground-color)"
        this.querySelector("p").style.color = "var(--secondary-foreground-color)"
        this.querySelector("h1").style.fontSize = "24px"
        this.querySelector("h1").style.marginBottom = "0px"
        this.querySelector("p").style.fontSize = "16px"
        this.style.display = "flex"
        this.style.flexDirection = "column"
        this.style.alignItems = "center"
        this.style.justifyContent = "center"
        this.style.height = "100%"
        this.style.width = "100%"
        this.querySelector(".meeting-finished-page-button-row").style.display = "flex"
        this.querySelector(".meeting-finished-page-button-row").style.flexDirection = "row"
        this.querySelector(".meeting-finished-page-button-row").style.alignItems = "center"
        this.querySelector(".meeting-finished-page-button-row").style.justifyContent = "center"
        this.querySelector(".meeting-finished-page-button-row").style.width = "100%"
        this.querySelector(".meeting-finished-page-button-row").style.gap = "10px"
        this.querySelector(".meeting-finished-page-button-meeting-list").addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/meetings")
            updateViewLocation()
        })
        this.querySelector(".meeting-finished-page-button-go-to-channel").addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/channel/" + window.location.pathname.split("/")[3])
            updateViewLocation()
        })
        this.querySelector(".meeting-finished-page-button-rejoin-meeting").addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/meeting/" + window.location.pathname.split("/")[3])
            updateViewLocation()
        })
    }
}

window.customElements.define("meeting-finished-page", MeetingFinishedPage)

class MeetingPrejoinPage extends HTMLElement {
    constructor() {
        super()
        this.stream = null
    }
    connectedCallback() {
        this.innerHTML = `
            <h1>Join Meeting</h1>
            <div class="meeting-prejoin-row">
                <div class="meeting-prejoin-video">
                    <video autoplay muted playsinline id="meeting-prejoin-video"></video>
                </div>
                <div class="meeting-prejoin-info">
                    <div class="meeting-prejoin-info-row">
                        <i class="icon-video"></i>
                        <div class="meeting-prejoin-info-row-text">Video</div>
                        <div class="meeting-prejoin-info-row-toggle">
                            <toggle-button class="meeting-prejoin-info-row-toggle-button-video"></toggle-button>
                        </div>
                    </div>
                    <div class="meeting-prejoin-info-row">
                        <i class="icon-mic"></i>
                        <div class="meeting-prejoin-info-row-text">Microphone</div>
                        <div class="meeting-prejoin-info-row-toggle">
                            <toggle-button class="meeting-prejoin-info-row-toggle-button-microphone"></toggle-button>
                        </div>
                    </div>
                    <div class="meeting-prejoin-info-row" id="meeting-prejoin-info-row-join">
                        <i class="icon-log-in"></i>
                        <div class="meeting-prejoin-info-row-text">Join Meeting</div>
                    </div>
                </div>
            </div>
        `
        if(window.localStorage.getItem("meetingVideo") == "false") {
            this.querySelector(".meeting-prejoin-info-row-toggle-button-video").setAttribute("checked", "false")
        } else {
            this.querySelector(".meeting-prejoin-info-row-toggle-button-video").setAttribute("checked", "true")
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    // Set the video element's source to the camera stream
                    this.stream = stream
                    const video = document.getElementById('meeting-prejoin-video');
                    video.srcObject = stream;
                })
                .catch((error) => {
                    console.error("Error accessing the camera: ", error);
                    window.localStorage.removeItem("meetingVideo")
                });
        }
        if(window.localStorage.getItem("meetingMicrophone") == "false") {
            this.querySelector(".meeting-prejoin-info-row-toggle-button-microphone").setAttribute("checked", "false")
        } else {
            this.querySelector(".meeting-prejoin-info-row-toggle-button-microphone").setAttribute("checked", "true")
        }
        this.querySelector(".meeting-prejoin-info-row-toggle-button-microphone").addEventListener("change", (event) => {
            if(!event.detail.checked) {
                window.localStorage.setItem("meetingMicrophone", "false")
            } else {
                window.localStorage.setItem("meetingMicrophone", "true")
            }
        })
        this.querySelector(".meeting-prejoin-info-row-toggle-button-video").addEventListener("change", (event) => {
            if(!event.detail.checked) {
                this.stream.getTracks().forEach(track => track.stop());
                window.localStorage.setItem("meetingVideo", "false")
                document.getElementById("meeting-prejoin-video").srcObject = null
            } else {
                window.localStorage.setItem("meetingVideo", "true")
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then((stream) => {
                        // Set the video element's source to the camera stream
                        this.stream = stream
                        const video = document.getElementById('meeting-prejoin-video');
                        video.srcObject = stream;
                    })
                    .catch((error) => {
                        console.error("Error accessing the camera: ", error);
                        window.localStorage.removeItem("meetingVideo")
                    });
                window.localStorage.removeItem("meetingVideo")
            }
        })
        this.querySelector("#meeting-prejoin-info-row-join").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("join-meeting"))
        })
    }
    disconnectedCallback() {
        this.stream.getTracks().forEach(track => track.stop());
    }
}

window.customElements.define("meeting-prejoin-page", MeetingPrejoinPage)

class MeetingSidebar extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="meeting-sidebar-inner">
                <div class="meeting-sidebar-header">
                    <div class="meeting-sidebar-header-title">Meeting</div>
                    <div class="meeting-sidebar-header-close">
                        <i class="icon-x"></i>
                    </div>
                </div>
                <div class="meeting-sidebar-content">
                </div>
            </div>
        `
    }
}

window.customElements.define("meeting-sidebar", MeetingSidebar)