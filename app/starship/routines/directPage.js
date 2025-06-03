import { getChannelInfo, getAllChannelMessages, joinChannelIo, getMessage, getMember } from "../src/clatterAPI.js"
import { showDialog } from "../components/dialog.js"

class directConnector {
    constructor({channelid, view, type, messageid}) {
        this.channelid = channelid
        this.messages = []
        this.view = view
        this.type = type? type : "channel"
        this.messageid = messageid? messageid : null
        this.intisreplying = false
        this.intreplymessage = null
    }
    set replymessage(messageid) {
        this.intreplymessage = messageid
    }
    get replymessage() {
        return this.intreplymessage
    }
    set isreplying(isreplying) {
        this.intisreplying = isreplying
        if (isreplying) {
            this.view.querySelector(".sendbutton-icon").classList.add("icon-reply")
            this.view.querySelector(".sendbutton-icon").classList.remove("icon-send")
            this.view.querySelector(".messageinput").placeholder = "Reply to Message"
            this.view.querySelector(".replyindicator-text").textContent = "Replying To Message"
            this.view.querySelector(".replyindicator").style.display = "flex"
        } else {
            this.view.querySelector(".sendbutton-icon").classList.remove("icon-reply")
            this.view.querySelector(".sendbutton-icon").classList.add("icon-send")
            this.intreplymessage = null
            this.view.querySelector(".messageinput").placeholder = "Send message to " + this.channelname
            this.view.querySelector(".replyindicator").style.display = "none"
            this.view.querySelector(".replyindicator-text").textContent = ""
        }
    }
    get isreplying() {
        return this.intisreplying
    }
    initalise = async function() {
        this.socket = await joinChannelIo(this.channelid)
        console.log(this.socket)
        this.socket.on("clatter.channel.message.recieve", async (res) => {
            var shouldstb = false
            if($(this.view.querySelector(".chatarea")).scrollTop() + $(this.view.querySelector(".chatarea")).height() + 15 >= this.view.querySelector(".chatarea").scrollHeight - 100) {
                shouldstb = true
            }
            if(this.type == "thread") {
                if (JSON.parse(res).parentmessageid == this.messageid) {
                    this.messages.push(JSON.parse(res))
                    var newmessage = document.createElement("clatter-message")
                    if (JSON.parse(res).userid != window.lastuserid) {
                        var users = (await authClient.organization.getFullOrganization()).data.members
                        users.forEach(item => {
                            if (item.user.id == JSON.parse(res).userid) {
                                newmessage.setAttribute("avatar", item.user.image)
                                newmessage.setAttribute("username", item.user.name)
                                window.lastuserid = JSON.parse(res).userid
                            }
                        })
                    }
                    newmessage.setAttribute("senderid", JSON.parse(res).userid)
                    newmessage.setAttribute("id", JSON.parse(res).id)
                    newmessage.innerText = JSON.parse(res).content
                    this.view.querySelector(".chatarea").appendChild(newmessage)
                }
            } else {
                this.messages.push(JSON.parse(res))
                var newmessage = document.createElement("clatter-message")
                newmessage.setAttribute("replymode", "direct")
                if (JSON.parse(res).userid != window.lastuserid) {
                    var users = (await authClient.organization.getFullOrganization()).data.members
                    users.forEach(item => {
                        if (item.user.id == JSON.parse(res).userid) {
                            newmessage.setAttribute("avatar", item.user.image)
                            newmessage.setAttribute("username", item.user.name)
                            window.lastuserid = JSON.parse(res).userid
                        }
                    })
                }
                if(JSON.parse(res).parentmessageid != undefined) {
                    newmessage.setAttribute("parentmessageid", JSON.parse(res).parentmessageid)
                    newmessage.setAttribute("isthread", "true")
                    var users = (await authClient.organization.getFullOrganization()).data.members
                    users.forEach(item => {
                        if (item.user.id == JSON.parse(res).userid) {
                            newmessage.setAttribute("avatar", item.user.image)
                            newmessage.setAttribute("username", item.user.name)
                        }
                    })
                }
                newmessage.setAttribute("senderid", JSON.parse(res).userid)
                newmessage.setAttribute("id", JSON.parse(res).id)
                newmessage.innerText = JSON.parse(res).content
                this.view.querySelector(".chatarea").appendChild(newmessage)
            }
            if (shouldstb) {
                this.view.querySelector(".chatarea").scrollTop = this.view.querySelector(".chatarea").scrollHeight
            }
        })
        var header = this.view.querySelector("qcl-header")
        var data = await getChannelInfo(this.channelid)
        var otheruser = data.members.filter(member => member != authsession.data.user.id)[0]
        var otheruser = await getMember(otheruser)
        this.channelname = otheruser.user.name
        this.otheruser = otheruser
        console.log(data.name)
        var headeritem = document.createElement("clatter-sidebar-item")
        headeritem.setAttribute("type", "imageicon")
        headeritem.setAttribute("channeltitle", otheruser.user.name)
        headeritem.setAttribute("icon", otheruser.user.image)
        // headeritem.addEventListener("click", () => {
        //     window.history.pushState(null, null, "/starship/direct/" + this.channelid)
        //     updateViewLocation()
        // })
        headeritem.style.marginTop = "0px"
        header.querySelector(".headertitletext").style.marginLeft = "5px"
        header.querySelector(".headertitletext").innerHTML = ""
        header.querySelector(".headertitletext").appendChild(headeritem)
        this.view.querySelector(".messageinput").placeholder = "Send message to " + otheruser.user.name
    }
    setPageTitle = function() {
        document.title = this.channelname + " | Clatter"
    }
    getMessage = async function(messageid) {
        var message = await getMessage(this.channelid, messageid)
        return message
    }
    loadMessages = async function() {
        var messages = getAllChannelMessages(this.channelid)
        return messages
    }
    sendMessage = function(msg) {
        if(this.intisreplying) {
            this.socket.emit("clatter.channel.message.send", JSON.stringify({
                "room": this.channelid,
                "userid": authsession.data.user.id,
                "sendername": authsession.data.user.name,
                "content": msg,
                "type": "text",
                "method": "modern",
                "parentmessageid": this.intreplymessage,
                "token": authsession.data.session.token,
            }))
            this.isreplying = false
        } else {
            this.socket.emit("clatter.channel.message.send", JSON.stringify({
                "room": this.channelid,
                "userid": authsession.data.user.id,
                "sendername": authsession.data.user.name,
                "content": msg,
                "type": "text",
                "method": "modern",
                "token": authsession.data.session.token,
            }))
        }
    }
    bindMessageBox = function(element) {
        this.boundelement = element
        element.querySelector(".messageinput").addEventListener("keydown", (e) => {
            if (e.key == "Enter" && e.shiftKey == false) {
                this.sendMessage(element.querySelector(".messageinput").value)
                element.querySelector(".messageinput").value = ""
            }
        })
        element.querySelector(".sendbutton").addEventListener("click", () => {
            this.sendMessage(element.querySelector(".messageinput").value)
            element.querySelector(".messageinput").value = ""
        })
    }
}

window.directConnector = directConnector