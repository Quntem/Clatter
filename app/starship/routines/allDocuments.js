import { listDocuments, createDocument } from "../src/clatterAPI.js"
import { showDialog } from "../components/dialog.js"

window.documentPageListUpdate = async function() {
    var documents = await listDocuments()
    document.getElementById("documentlistcontainer").innerHTML = ``
    documents.forEach(doc => {
        var item = document.createElement("div")
        item.className = "channellistitem"
        var icon = document.createElement("i")
        icon.className = "icon-file-text channellistitem-icon"
        var text = document.createElement("div")
        text.className = "channellistitem-text"
        text.textContent = doc.name
        item.appendChild(icon)
        item.appendChild(text)
        item.addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/document/" + doc.id)
            updateViewLocation()
        })
        document.getElementById("documentlistcontainer").appendChild(item)
    })
}

window.documentPageAddButtonEvent = function() {
    document.querySelector(".add-button").addEventListener("click", () => {
        showDialog({
            title: "Create Document",
            content: "",
            type: "confirm"
        }).then(async () => {
            await createDocument(window.adddocumentname)
            setTimeout(() => {
                window.documentPageListUpdate()
            }, 50)
        })
        setTimeout(() => {
            var input = document.createElement("input")
            input.setAttribute("type", "text")
            input.setAttribute("placeholder", "Document Name")
            document.querySelector(".dialog-body").prepend(input)
            input.addEventListener("input", () => {
                window.adddocumentname = input.value
            })
        }, 50)
    })
}