import { getChannelInfo, getChannelMessages, getThreadMessages, joinChannelIo, getMessage } from "../src/clatterAPI.js"
import { showDialog } from "../components/dialog.js"

class channelConnector {
    constructor({channelid, view, type, messageid}) {
        this.channelid = channelid
        this.messages = []
        this.view = view
        this.type = type? type : "channel"
        this.messageid = messageid? messageid : null
    }
    initalise = async function() {
        this.socket = await joinChannelIo(this.channelid)
        console.log(this.socket)
        this.socket.on("clatter.channel.message.recieve", async (res) => {
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
                if (JSON.parse(res).parentmessageid == undefined) {
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
            }
        })
        var header = this.view.querySelector("qcl-header")
        var data = await getChannelInfo(this.channelid)
        this.channelname = data.name
        console.log(data.name)
        header.querySelector(".headertitletext").textContent = data.name + (this.type == "thread"? " > Thread" : "")
        console.log(header.querySelector(".headertitletext"))
        this.view.querySelector(".messageinput").placeholder = "Send message to #" + data.name
    }
    setPageTitle = function() {
        document.title = "#" + this.channelname + (this.type == "channel"? "" : " > Thread") + " | Clatter"
    }
    getMessage = async function(messageid) {
        var message = await getMessage(this.channelid, messageid)
        return message
    }
    loadMessages = async function() {
        if(this.type == "thread") {
            var messages = await getThreadMessages(this.channelid, this.messageid)
        } else {
            var messages = await getChannelMessages(this.channelid)
        }
        return messages
    }
    sendMessage = function(msg) {
        if(this.type == "thread") {
            this.socket.emit("clatter.channel.message.send", JSON.stringify({
                "room": this.channelid,
                "userid": authsession.data.user.id,
                "sendername": authsession.data.user.name,
                "content": msg,
                "type": "text",
                "method": "modern",
                "parentmessageid": this.messageid,
                "token": authsession.data.session.token,
            }))
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

window.channelConnector = channelConnector