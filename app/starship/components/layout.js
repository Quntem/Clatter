export function Row() {
    var row = document.createElement("div")
    row.classList.add("layout-row")
    return row
}

export function Header(options) {
    var header = document.createElement("layout-header")
    var closebutton = document.createElement("i")
    closebutton.classList.add("icon-x")
    closebutton.style.fontSize = "20px"
    closebutton.style.cursor = "pointer"
    closebutton.style.marginLeft = "auto"
    if (options.onClose) {
        closebutton.addEventListener("click", () => {
            options.onClose()
        })
    }
    header.appendChild(closebutton)
    return header
}

    
