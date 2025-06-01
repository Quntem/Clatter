export function Row() {
    var row = document.createElement("div")
    row.classList.add("layout-row")
    return row
}

export function Header(options) {
    var header = document.createElement("layout-header")
    var closebutton = document.createElement("i")
    if (options?.canClose == true || options?.canClose == undefined) {
        closebutton.classList.add("icon-x")
        closebutton.classList.add("layout-header-close")
        closebutton.style.fontSize = "20px"
        closebutton.style.cursor = "pointer"
        closebutton.style.marginLeft = "auto"
        header.appendChild(closebutton)
    }
    if (options?.onClose != undefined) {
        closebutton.addEventListener("click", () => {
            options.onClose()
        })
    }
    return header
}

    
