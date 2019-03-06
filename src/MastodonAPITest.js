import vdom from "./vdom.js";

export default class MastodonAPITest extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = TEMPLATE;
    this.vdom = vdom(shadow.querySelector(".main"));
    this.vdom.set({
      statusText: "ready.",
    });
  }
}

const TEMPLATE = `
<div class="main"></div>
`;