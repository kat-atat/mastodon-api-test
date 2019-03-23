import {h, app} from "./hyperapp.js";
import client from "./view/client.js";
import state from "./state.js";
import action from "./action.js";

const view = (state, action)=>
  h("div", {}, [
    client(state, action),
  ])

export default (node)=> app(state, action, view, node);
