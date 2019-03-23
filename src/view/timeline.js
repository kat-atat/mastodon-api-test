import {h, app} from "../hyperapp.js";
import statusView from "./status.js";

const timeline = ({timeline}, action)=>
  h("div", {class: "timeline"},
    timeline.map((status)=>
      h("div", {class: "timeline__status"}, statusView({status}, action))
    )
  )

export default timeline;