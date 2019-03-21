import {h, app} from "../hyperapp.js";
import timeline from "./timeline.js";
import account from "./account.js";

const client = (state, action)=>
  h("div", {class: "client"}, [
    h("div", {class: "client__info"}, [
      h("p", {}, state.info),
    ]),

    h("div", {class: "client__actions"}, [
      h("button", {onclick: ()=> action.fetch()}, "fetch_all"),
      h("button", {onclick: ()=> action.fetch_account()}, "fetch_account"),
      h("button", {onclick: ()=> action.fetch_ltl()}, "fetch_ltl"),
      h("button", {onclick: ()=> action.fetch_ltl_media_only()}, "fetch_ltl_media_only"),
      h("button", {onclick: ()=> action.fetch_htl()}, "fetch_htl"),
      h("button", {onclick: ()=> action.fetch_federated()}, "fetch_federated"),
      h("button", {onclick: ()=> action.fetch_federated_media_only()}, "fetch_federated_media_only"),
      h("button", {onclick: ()=> action.clear()}, "clear"),
    ]),

    h("div", {class: "client__account"},
      state.account
        ? account(state.account)
        : null,
    ),

    h("div", {class: "client__timeline"},
      state.timeline
        ? timeline(state.timeline, action)
        : null,
    ),
  ])

export default client;