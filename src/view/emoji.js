import {h, app} from "../hyperapp.js";

const emoji = ({emoji})=>
  h("span", {class: "emoji"},
    h("img", {src: emoji.url}),
  )

export default emoji;