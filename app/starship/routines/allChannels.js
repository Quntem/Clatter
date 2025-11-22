import { getChannels, createChannel } from "../src/clatterAPI.js"
import { showDialog } from "../components/dialog.js"

window.channelPageListUpdate = async function() {
    var channels = await getChannels()
    document.getElementById("channellistcontainer").innerHTML = ``
    channels.forEach(channel => {
        var item = document.createElement("div")
        item.className = "channellistitem"
        var icon = document.createElement("i")
        icon.className = "icon-hash channellistitem-icon"
        var text = document.createElement("div")
        text.className = "channellistitem-text"
        text.textContent = channel.name
        item.appendChild(icon)
        item.appendChild(text)
        item.addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/channel/" + channel.id)
            updateViewLocation()
        })
        document.getElementById("channellistcontainer").appendChild(item)
    })
}

window.channelPageAddButtonEvent = function() {
    document.querySelector(".add-button").addEventListener("click", () => {
        showDialog({
            title: "Create Channel",
            content: "",
            type: "confirm"
        }).then(async () => {
            await createChannel(window.addchannelname)
            window.channelPageListUpdate()
            window.updateChannelList()
        })
        setTimeout(() => {
            var input = document.createElement("input")
            input.setAttribute("type", "text")
            input.setAttribute("placeholder", "Channel Name")
            document.querySelector(".dialog-body").prepend(input)
            input.addEventListener("input", () => {
                window.addchannelname = input.value
            })
        }, 50)
    })
}