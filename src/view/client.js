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

    h("div", {class: "client__actions actions"}, [
      h("span", {
        class: "actions__home-timeline button",
        onclick: ()=> action.onClientHomeTimelineButtonClick(client),
      }),

      h("span", {
        class: "actions__local-timeline button",
        onclick: ()=> action.onClientLocalTimelineButtonClick(client),
      }),

      h("span", {
        class: "actions__local-media-timeline button",
        onclick: ()=> action.onClientLocalMediaTimelineButtonClick(client),
      }),

      h("span", {
        class: "actions__federated-timeline button",
        onclick: ()=> action.onClientFederatedTimelineButtonClick(client),
      }),

      h("span", {
        class: "actions__federated-media-timeline button",
        onclick: ()=> action.onClientFederatedMediaTimelineButtonClick(client),
      }),

      h("span", {
        class: "actions__scroll-top button",
        onclick: ()=> action.onClientScrollTopButtonClick(client),
      }),

      h("span", {
        class: "actions__account button",
        onclick: ()=> action.onClientAccountButtonClick(client),
      }),

      h("span", {
        class: "actions__clear button",
        onclick: ()=> action.onClientClearButtonClick(client),
      }),
    ]),
  ])


export default client;
