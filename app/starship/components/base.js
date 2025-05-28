export class ClatterViewBase {
    constructor() {
        this.element = document.createElement("clatter-base-view")
        this.element.setAttribute("open", "false")
    }
}

export class ClatterSidebarSection {
    constructor() {
        this.element = document.createElement("clatter-sidebar-section")
    }
}