import { scriptLoad } from "../src/clatterAPI";
// await scriptLoad("https://int_jitsi.qplus.cloud/libs/lib-jitsi-meet.min.js");
// JitsiMeetJS.init();
// window.connection = new JitsiMeetJS.JitsiConnection(null, null, {
//     hosts: {
//         domain: "int_jitsi.qplus.cloud",
//     },
//     serviceUrl: "wss://int_jitsi.qplus.cloud",
//     enableWebsocketResume: true,
// })
// window.connection.connect()
// window.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, () => {
//     console.log("Connected")
// })
window.loadMeeting = async function() {
    await scriptLoad("https://int_jitsi.qplus.cloud/external_api.js");
    var meetingJoinPage = document.createElement("meeting-prejoin-page")
    document.querySelector("#meetingcontainer").appendChild(meetingJoinPage)
    meetingJoinPage.addEventListener("join-meeting", () => {
        meetingJoinPage.remove()
        joinMeeting()
    })
    var joinMeeting = function() {
        var domain = "int_jitsi.qplus.cloud"
        var options = {
            roomName: window.location.pathname.split("/")[3],
            width: "100%",
            height: "100%",
            parentNode: document.querySelector("#meetingcontainer"),
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    
                ],
            },
            configOverwrite: {
                prejoinConfig: {
                    enabled: false
                },
                deeplinking: {
                    disabled: true
                },
                startWithVideoMuted: window.localStorage.getItem("meetingVideo") == "false",
                startWithAudioMuted: window.localStorage.getItem("meetingMicrophone") == "false"
            },
            userInfo: {
                displayName: authsession.data.user.name,
                email: authsession.data.user.email
            }
        }
        window.meeting = new JitsiMeetExternalAPI(domain, options)
        var meetingSidebar = document.createElement("meeting-sidebar")
        document.querySelector("#meetingcontainer").appendChild(meetingSidebar)
        var customToolbarOptions = [
            {
                icon: "icon-mic-off",
                tooltip: "Mute/Unmute",
                onClick: () => {
                    window.meeting.executeCommand("toggleAudio")
                },
                id: "toolbar-toggleAudio"
            },
            {
                icon: "icon-video",
                tooltip: "Disable/Enable Video",
                onClick: () => {
                    window.meeting.executeCommand("toggleVideo")
                },
                id: "toolbar-toggleVideo"
            },
            {
                icon: "icon-monitor",
                tooltip: "Share Screen",
                onClick: () => {
                    window.meeting.executeCommand("toggleShareScreen")
                }
            },
            {
                icon: "icon-users",
                tooltip: "Participants",
                onClick: () => {
                    window.meeting.executeCommand("toggleParticipantsPane", true)
                    // if(meetingSidebar.getAttribute("open") == "true") {
                    //     meetingSidebar.setAttribute("open", "false")
                    // } else {
                    //     meetingSidebar.setAttribute("open", "true")
                    // }
                }
            },
            {
                icon: "icon-phone-off",
                tooltip: "End Meeting",
                onClick: () => {
                    window.meeting.executeCommand("hangup")
                }
            }
        ]
        var spacer = document.createElement("div")
        spacer.style.flexGrow = 1
        document.querySelector("qcl-header").appendChild(spacer)
        customToolbarOptions.forEach(option => {
            var icon = document.createElement("i")
            icon.className = option.icon
            icon.title = option.tooltip
            icon.onclick = option.onClick
            icon.style.cursor = "pointer"
            icon.classList.add("videoconference-toolbar-button")
            icon.style.marginLeft = "15px"
            if(option.id != undefined) {
                icon.id = option.id
            }
            document.querySelector("qcl-header").appendChild(icon)
        })
        var endspacer = document.createElement("div")
        endspacer.style.width = "5px"
        document.querySelector("qcl-header").appendChild(endspacer)
        window.meeting.addEventListener("videoConferenceJoined", () => {
            console.log("Joined")
        })
        window.meeting.addEventListener("readyToClose", () => {
            console.log("Left")
            window.meeting.dispose()
            $(".videoconference-toolbar-button").remove()
            document.querySelector("#meetingcontainer").innerHTML = ""
            document.querySelector("#meetingcontainer").appendChild(document.createElement("meeting-finished-page"))
        })
        window.meeting.addEventListener("participantKickedOut", (event) => {
            if(event.kicked.local == true) {
                console.log("Left")
                window.meeting.dispose()
                $(".videoconference-toolbar-button").remove()
                document.querySelector("#meetingcontainer").innerHTML = ""
                var kickedPage = document.createElement("meeting-finished-page")
                kickedPage.setAttribute("reason", "You were kicked from the meeting")
                document.querySelector("#meetingcontainer").appendChild(kickedPage)
            }
        })
        window.meeting.addEventListener("audioMuteStatusChanged", (event) => {
            if(event.muted) {
                document.querySelector("#toolbar-toggleAudio").classList.remove("icon-mic")
                document.querySelector("#toolbar-toggleAudio").classList.add("icon-mic-off")
            } else {
                document.querySelector("#toolbar-toggleAudio").classList.remove("icon-mic-off")
                document.querySelector("#toolbar-toggleAudio").classList.add("icon-mic")
            }
        })
        window.meeting.addEventListener("videoMuteStatusChanged", (event) => {
            if(event.muted) {
                document.querySelector("#toolbar-toggleVideo").classList.remove("icon-video")
                document.querySelector("#toolbar-toggleVideo").classList.add("icon-video-off")
            } else {
                document.querySelector("#toolbar-toggleVideo").classList.remove("icon-video-off")
                document.querySelector("#toolbar-toggleVideo").classList.add("icon-video")
            }
        })
    }
}