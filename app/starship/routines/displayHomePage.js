import { ClatterViewBase } from "../components/base.js";
import { pageViewManager } from "../scripts/renderer.js";
import { Header } from "../components/layout.js";

export function openHomePage() {
    var view = new ClatterViewBase()
    var header = Header()
    var title = document.createElement("div")
    title.innerText = "Home"
    header.prepend(title)
    view.element.appendChild(header)
    x = pageViewManager.addView(view)
}
