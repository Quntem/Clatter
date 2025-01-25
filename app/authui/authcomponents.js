// Create a class for the element
import { authClient, signIn, signOut, signUp, getSession } from "/auth-client.js"

window.authClient = authClient

authClient.getSession().then((res) => {
    if (res.data == null) {
        window.location.replace("/authui/index.html?callback=" + window.location.toString())
    }
})

window.auth = {
    
}

class authusericon extends HTMLElement {
    static observedAttributes = ["color", "size"];
  
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
      console.log("Custom element added to page.");
      authClient.getSession().then((res) => {
          if (res.data == null) {
              window.location.replace("/authui/index.html?callback=" + window.location.toString())
          } else {
              this.setAttribute("title", res.data.user.email)
          }
      })
    }
  
    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }
  
    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed.`);
    }
  }
  
  customElements.define("auth-userbutton", authusericon);
  