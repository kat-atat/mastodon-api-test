import {h, app} from "../hyperapp.js";
import timelineView from "./timeline.js";
import accountView from "./account.js";

const client = ({timeline, account, info, client}, action)=>
  h("div", {
    class: "client"
    + (client.show === "timeline" ? " client--show-timeline" : "")
    + (client.show === "account" ? " client--show-account" : ""),
  }, [
    h("div", {class: "client__info"}, [
      h("p", {}, info),
    ]),

    h("div", {class: "client__actions"}, [
      h("button", {onclick: ()=> action.onClientHomeTimelineButtonClick(client)}, "Home"),
      h("button", {onclick: ()=> action.onClientLocalTimelineButtonClick(client)}, "Local"),
      h("button", {onclick: ()=> action.onClientLocalMediaTimelineButtonClick(client)}, "Local(media)"),
      h("button", {onclick: ()=> action.onClientFederatedTimelineButtonClick(client)}, "Federated"),
      h("button", {onclick: ()=> action.onClientFederatedMediaTimelineButtonClick(client)}, "Federated(media)"),
      h("button", {onclick: ()=> action.onClientScrollTopButtonClick(client)}, "scrollTop"),
      h("button", {onclick: ()=> action.onClientAccountButtonClick(client)}, "Account"),
      h("button", {onclick: ()=> action.onClientClearButtonClick(client)}, "clear"),
    ]),

    h("div", {class: "client__account"},
      account
        ? accountView({account}, action)
        : null,
    ),

    h("div", {class: "client__timeline", scrollTop: client.scrollY}, [
      timeline
        ? timelineView({timeline}, action)
        : null,
    ]),
  ])


export default client;
