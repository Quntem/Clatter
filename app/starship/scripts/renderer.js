export var pageViewManager = {
    pages: [],
    addView: function(view) {
        document.getElementById("mainarea").appendChild(view.element)
        this.pages.push(view)
        setTimeout(() => {
            view.element.setAttribute("open", "true")
        }, 10)
        return new ClatterPageView({element: view.element, view: view})
    }
}

export var sidebarManager = {
    sections: [],
    addSection: function(view) {
        if(Array.isArray(view)) {
            view.forEach((v) => {
                document.getElementById("sidebar").appendChild(v.element)
                this.sections.push(v)
            })
        } else {
            document.getElementById("sidebar").appendChild(view.element)
            this.sections.push(view)
        }
    }
}

class ClatterPageView {
    constructor(opts) {
        this.element = opts.element
        this.view = opts.view
    }

    close() {
        this.element.setAttribute("open", "false")
        setTimeout(() => {
            this.element.remove()
        }, 100)
    }
}
    