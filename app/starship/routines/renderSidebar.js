import { sidebarManager } from "../scripts/renderer.js";
import { ClatterSidebarSection } from "../components/base.js";
import { Row } from "../components/layout.js";
import { openComposePage } from "./composepage.js";

function workspaceIcon() {
    var image = document.createElement("img")
    image.classList.add("sidebar-workspace-icon")
    return image
}

function workspaceText() {
    var text = document.createElement("div")
    text.classList.add("sidebar-workspace-text")
    return text
}

function composeButton() {
    var button = document.createElement("button")
    button.classList.add("sidebar-header-button")
    button.innerText = "Compose"
    button.addEventListener("click", () => {
        openComposePage()
    })
    return button
}

export function sidebarHeader() {
    var sidebarheader = new ClatterSidebarSection()
    var row = Row()
    var image = workspaceIcon()
    var text = workspaceText()
    text.innerText = "Workspace Name"
    row.appendChild(image)
    row.appendChild(text)
    sidebarheader.element.appendChild(row)
    sidebarheader.element.appendChild(composeButton())
    return sidebarheader
}
