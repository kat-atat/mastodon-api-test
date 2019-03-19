import vdom from "./vdom.js";

export default class MastodonAPITest extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = TEMPLATE;
    this.vdom = vdom(shadow.querySelector(".main"));
  }

  static get observedAttributes() {
    return [
      "mastodon-url",
      "access-token",
    ];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case "mastodon-url": return this.vdom.set({mastodon_url: newVal});
      case "access-token": return this.vdom.set({access_token: newVal});
    }
  }
}

const TEMPLATE = `
<div class="main"></div>
`;