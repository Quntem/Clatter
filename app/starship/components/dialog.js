class dialog extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="dialog-background"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <div class="dialog-title">${this.getAttribute("dlg-title")}</div>
                    <i class="icon-x dialog-close"></i>
                </div>
                <div class="dialog-body">
                    ${this.innerHTML}
                </div>
            </div>
        `
        if(this.getAttribute("type") == "confirm") {
            this.querySelector(".dialog-body").innerHTML += `
                <div class="dialog-footer">
                    <button class="dialog-button-cancel">Cancel</button>
                    <button class="dialog-button-confirm">Confirm</button>
                </div>
            `
        }
        this.querySelector(".dialog-close").addEventListener("click", () => {
            this.remove()
        })
    }
}

window.customElements.define("clatter-dialog", dialog)

export function showDialog(options) {
    return new Promise((resolve, reject) => {
        const dialog = document.createElement("clatter-dialog")
        dialog.setAttribute("dlg-title", options.title)
        dialog.setAttribute("type", options.type)
        dialog.innerHTML = options.content
        document.body.appendChild(dialog)
        if(options.type == "confirm") {
            dialog.querySelector(".dialog-close").addEventListener("click", () => {
                reject()
                dialog.remove()
            })
            dialog.querySelector(".dialog-button-confirm").addEventListener("click", () => {
                resolve()
                dialog.remove()
            })
            dialog.querySelector(".dialog-button-cancel").addEventListener("click", () => {
                reject()
                dialog.remove()
            })
        } else {
            dialog.querySelector(".dialog-close").addEventListener("click", () => {
                resolve()
                dialog.remove()
            })
        }
    })
}
    