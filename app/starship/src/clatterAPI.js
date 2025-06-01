export function getChannels() {
    return new Promise(async (resolve, reject) => {
        var req = await fetch("/api/channels/list")
        var data = await req.json()
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
