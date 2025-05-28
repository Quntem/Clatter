import { ClatterViewBase } from "../components/base.js";
import { pageViewManager } from "../scripts/renderer.js";

export function openComposePage() {
    var view = new ClatterViewBase()
    view.element.innerHTML = `
        <h1>Compose</h1>
    `
    pageViewManager.addView(view)
}
