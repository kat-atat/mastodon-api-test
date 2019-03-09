import {h, app} from "../hyperapp.js";
import status from "./status.js";

const timeline = (statuses)=>
  h("div", {class: "timeline"},
    statuses
    .map((a_status)=> h("div", {class: "timeline__status"}, status(a_status)))
  )

export default timeline;