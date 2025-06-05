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
        this.style.color = "#666666"
        this.querySelector(".meeting-finished-page-button-row").style.display = "flex"
        this.querySelector(".meeting-finished-page-button-row").style.flexDirection = "row"
        this.querySelector(".meeting-finished-page-button-row").style.alignItems = "center"
        this.querySelector(".meeting-finished-page-button-row").style.justifyContent = "center"
        this.querySelector(".meeting-finished-page-button-row").style.width = "100%"
        this.querySelector(".meeting-finished-page-button-row").style.gap = "10px"
        this.querySelector(".meeting-finished-page-button-meeting-list").addEventListener("click", () => {
            NavigatePage("meetinglist")
        })
        this.querySelector(".meeting-finished-page-button-go-to-channel").addEventListener("click", () => {
            NavigatePage("channelpage")
        })
        this.querySelector(".meeting-finished-page-button-rejoin-meeting").addEventListener("click", () => {
            NavigatePage("meetingpage")
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