import APIUtil from "./APIUtil.js";

export default {
  onStatusSpoilerTextClick: (status)=> {
    status.showSensitive = !status.showSensitive;
    return {};
  },
  onStatusShowSensitiveToggleClick: (status)=> {
    status.showSensitive = !status.showSensitive;
    return {};
  },

  onClientHomeTimelineButtonClick: (client)=> (state, action)=> {
    client.show = "timeline";
    action.timelineFetch("home");
    return {};
  },
  onClientLocalTimelineButtonClick: (client)=> (state, action)=> {
    client.show = "timeline";
    action.timelineFetch("local");
    return {};
  },
  onClientLocalMediaTimelineButtonClick: (client)=> (state, action)=> {
    client.show = "timeline";
    action.timelineFetch("local-media");
    return {};
  },
  onClientFederatedTimelineButtonClick: (client)=> (state, action)=> {
    client.show = "timeline";
    action.timelineFetch("federated");
    return {};
  },
  onClientFederatedMediaTimelineButtonClick: (client)=> (state, action)=> {
    client.show = "timeline";
    action.timelineFetch("federated-media");
    return {};
  },
  onClientAccountButtonClick: (client)=> (state, action)=> {
    client.show = "account";
    action.accountFetch();
    return {};
  },
  onClientScrollTopButtonClick: (client)=> (state, action)=> {
    client.scrollY = client.scrollY + 0.0000001;
    return {};
  },
  onClientClearButtonClick: (client)=> (state, action)=> action.clear(),

  accountFetch: (mode)=> async ({mastodon_url, access_token}, action)=> {
    let account = await APIUtil.url(mastodon_url).account().self({access_token});
    action.set({account, info: "account fetched."});
  },

  timelineFetch: (mode)=> async ({mastodon_url, access_token}, action)=> {
    let api = APIUtil.url(mastodon_url).timeline();
    let state;
    switch (mode) {
      case "home": state = {
        timeline: await api.home({access_token}),
        info: "home-timeline fetched.",
      };break;

      case "local": state = {
        timeline: await api.local(),
        info: "local-timeline fetched.",
      };break;

      case "local-media": state = {
        timeline: await api.local({only_media: true}),
        info: "local-timeline(media only) fetched.",
      };break;

      case "federated": state = {
        timeline: await api.federated(),
        info: "federated-timeline fetched.",
      };break;

      case "federated-media": state = {
        timeline: await api.federated({only_media: true}),
        info: "federated-timeline(media only) fetched.",
      };break;
    }
    action.set(state);
  },

  clear: ()=> ({timeline: [], account: null, info: "responces cleared."}),

  set: (newState)=> (state)=> ({state, ...newState}),
};