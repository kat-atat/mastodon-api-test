import vdom from "./vdom.js";

export default class MastodonAPITest extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = TEMPLATE;
    vdom(shadow.querySelector(".main"));
  }
}

const TEMPLATE = `
<style></style>
<div class="main"></div>
`;