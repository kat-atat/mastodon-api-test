import APIUtil from "./APIUtil.js";

export default {
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
    status.showSensitive = !status.showSensitive;
    return {};
  }
};