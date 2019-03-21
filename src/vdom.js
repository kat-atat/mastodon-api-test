import {h, app} from "./hyperapp.js";
import APIUtil from "./APIUtil.js";
import timeline from "./view/timeline.js";
import account from "./view/account.js";

const state = {
  mastodon_url: "",
  access_token: "",
  info: "ready.",
  timeline: [],
  account: null,
};

const action = {
  fetch: ()=> (state, action)=> {
    action.fetch_account();
    action.fetch_ltl();
  },
  fetch_account: ()=> async ({mastodon_url, access_token}, action)=> {
    let account = await APIUtil.url(mastodon_url).account().self({access_token});
    action.set({account, info: "account fetched."});
  },
  fetch_ltl: ()=> async ({mastodon_url}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().local();
    action.set({timeline, info: "local-timeline fetched."});
  },
  fetch_ltl_media_only: ()=> async ({mastodon_url}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().local({only_media: true});
    action.set({timeline, info: "local-timeline(media only) fetched."});
  },
  fetch_htl: ()=> async ({mastodon_url, access_token}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().home({access_token});
    action.set({timeline, info: "home-timeline fetched."});
  },
  fetch_federated: ()=> async ({mastodon_url}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().federated();
    action.set({timeline, info: "federated-timeline fetched."});
  },
  fetch_federated_media_only: ()=> async ({mastodon_url}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().federated({only_media: true});
    action.set({timeline, info: "federated-timeline(media only) fetched."});
  },
  clear: ()=> {
    return {timeline: [], account: null, info: "responces cleared."};
  },
  set: (newState)=> (state)=> ({state, ...newState}),

  onStatus_spoilerText_click: (status)=> ()=> {
    status.sensitiveAccepted = !status.sensitiveAccepted;
    return {};
  }
};

const view = (state, action)=>
  h("div", {}, [
    h("div", {class: "info"}, [
      h("p", {}, state.info),
    ]),
    h("div", {class: "actions"}, [
      h("button", {onclick: ()=> action.fetch()}, "fetch_all"),
      h("button", {onclick: ()=> action.fetch_account()}, "fetch_account"),
      h("button", {onclick: ()=> action.fetch_ltl()}, "fetch_ltl"),
      h("button", {onclick: ()=> action.fetch_ltl_media_only()}, "fetch_ltl_media_only"),
      h("button", {onclick: ()=> action.fetch_htl()}, "fetch_htl"),
      h("button", {onclick: ()=> action.fetch_federated()}, "fetch_federated"),
      h("button", {onclick: ()=> action.fetch_federated_media_only()}, "fetch_federated_media_only"),
      h("button", {onclick: ()=> action.clear()}, "clear"),
    ]),
    h("div", {class: "responce"}, [
      h("div", {class: "responce__account"},
        state.account
          ? account(state.account)
          : null,
      ),
      h("div", {class: "responce__timeline"},
        state.timeline
          ? timeline(state.timeline, action)
          : null,
      ),
    ]),
  ])

export default (node)=> app(state, action, view, node);
