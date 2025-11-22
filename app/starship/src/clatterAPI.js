export function getChannels() {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channels/list")
        var data = await req.json()
        data.forEach((channel, index) => {
            if(channel.type.split(".")[1] != "channeltype") {
                data.splice(index, 1)
            }
        })
        resolve(data)
    })
}

export function listDocuments() {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/documents/listown")
        var data = await req.json()
        resolve(data)
    })
}

export function getDocument(documentid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/documents/" + documentid + "/content")
        var data = await req.json()
        resolve(data)
    })
}

export function createDocument(documentname) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/document/create?name=" + encodeURIComponent(documentname))
        var data = await req.json()
        console.log(data)
        resolve()
    })
}

export function removeMember(userid) {
    return new Promise(async (resolve, reject) => {
        await authClient.organization.removeMember({
            memberIdOrEmail: userid,
            organizationId: authsession.data.organization.id
        })
        resolve()
    })
}

export function updateDocument(documentid, documentcontent) {
    return new Promise(async (resolve, reject) => {
        await fetch("/api/documents/" + documentid + "/content", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({content: documentcontent})
        })
        resolve()
    })
}

export function getMember(userid) {
    return new Promise(async (resolve, reject) => {
        var req = (await authClient.organization.getFullOrganization()).data.members.find(member => member.user.id == userid)
        resolve(req)
    })
}

export function getDirectMessages() {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channels/list")
        var data = await req.json()
        data = data.filter((channel) => {
            if(channel.type.split(".")[1] != "directtype") {
                return false
            }
            return true
        })
        console.log(data)
        resolve(data)
    })
}

export function getDirectory() {
    return new Promise(async (resolve, reject) => {
        var res = await authClient.organization.getFullOrganization()
        resolve(res.data.members)
    })
}

export function addMember(userid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/workspace/users/add?id=" + encodeURIComponent(userid), {
            "method": "POST",
        })
        resolve()
    })
}

export function createChannel(name) {
    return new Promise(async (resolve, reject) => {
        await fetch("/api/channels/create?channelname=" + encodeURIComponent(name), {
            "method": "POST",
        })
        resolve()
    })
}

export function getChannelInfo(channelid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/info")
        var data = await req.json()
        resolve(data)
    })
}

export function getChannelMessages(channelid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/messages/list")
        var data = await req.json()
        resolve(data)
    })
}

export function getAllChannelMessages(channelid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/messages/list?all=true")
        var data = await req.json()
        resolve(data)
    })
}

export function getThreadMessages(channelid, messageid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/thread/" + messageid + "/messages/list")
        var data = await req.json()
        resolve(data)
    })
}

export function getMessage(channelid, messageid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/message/" + messageid + "/info")
        var data = await req.json()
        resolve(data)
    })
}

export function joinChannelIo(channelid) {
    return new Promise(async (resolve, reject) => {
        try {
            socket.destroy()
            socket = io()
        } catch {
            var socket = io()
        }
        socket.on("clatter.channel.join.response", (res) => {
            resolve(socket)
        })
        socket.emit("clatter.channel.join", JSON.stringify({
            "room": channelid
        }))
    })
}

export function deleteMessage(channelid, messageid) {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channel/" + channelid + "/message/" + messageid + "/delete")
        var data = await req.json()
        resolve(data)
    })
}

export function scriptLoad(url) {
    return new Promise(resolve => {
        $.getScript(url, () => {
            resolve()
        })
    })
}

window.getChannelMessages = getChannelMessages
