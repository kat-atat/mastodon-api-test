import {h, app} from "./hyperapp.js";
import APIUtil from "./APIUtil.js";
import timeline from "./view/timeline.js";
import account from "./view/account.js";

const state = {
  mastodon_url: "",
  access_token: "",
  info: "ready.",
  timeline: [],
  account: {},
};

const action = {
  fetch: ()=> (state, action)=> {
    action.fetch_account();
    action.fetch_timeline();
  },
  fetch_account: ()=> async ({mastodon_url, access_token}, action)=> {
    let account = await APIUtil.url(mastodon_url).account().self({access_token});
    action.set({account});
  },
  fetch_timeline: ()=> async ({mastodon_url}, action)=> {
    let timeline = await APIUtil.url(mastodon_url).timeline().local();
    action.set({timeline});
  },
  clear: ()=> {
    return {timeline: [], account: null, info: "responces cleared."};
  },
  set: (newState)=> (state)=> ({state, ...newState}),
};

const view = (state, action)=>
  h("div", {}, [
    h("div", {class: "info"}, [
      h("p", {}, state.info),
    ]),
    h("div", {class: "actions"}, [
      h("button", {onclick: ()=> action.fetch()}, "fetch_all"),
      h("button", {onclick: ()=> action.fetch_account()}, "fetch_account"),
      h("button", {onclick: ()=> action.fetch_timeline()}, "fetch_timeline"),
      h("button", {onclick: ()=> action.clear()}, "clear"),
    ]),
    h("div", {class: "responce"}, [
      h("div", {class: "account"},
        state.account
          ? account(state.account)
          : null,
      ),
      h("div", {class: "timeline"},
        state.timeline
          ? timeline(state.timeline)
          : null,
      ),
    ]),
  ])

export default (node)=> app(state, action, view, node);
