
const APIUtil = {

  // Returns {id, client_id, client_secret} || {error}
  requestApp: async ({mastodon_url, client_name, redirect_uris, scopes, website=""})=> {

    const request = new Request(mastodon_url + "/api/v1/apps", {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_name,
        redirect_uris,
        scopes,
        response_type: "code",
        website,
      }),
    });

    let response = await fetch(request);
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  // Returns {access_token, token_type, scope, created_at} || {error}
  requestToken: async ({mastodon_url, client_id, client_secret, code, redirect_uri})=> {

    const request = new Request(mastodon_url + "/oauth/token", {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_id,
        client_secret,
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
    });

    let response = await fetch(request);
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  requestRevoke: async ({mastodon_url, client_id, client_secret})=> {

    const request = new Request(mastodon_url + "/oauth/revoke", {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_id,
        client_secret,
      }),
    });

    let response = await fetch(request);
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  createAuthUrl: ({mastodon_url, client_id, redirect_uri})=> {

    const url = new URL(mastodon_url + "/oauth/authorize");
    const s = url.searchParams;
    s.set("client_id", client_id);
    s.set("redirect_uri", redirect_uri);
    s.set("response_type", "code");

    return url;
  },

  onresponsed: (responsed)=> {},

  body: (params)=> {
    const body = new URLSearchParams();
    for (let key in params) {
      body.set(key, params[key]);
    }
    return body;
  },

  __requestTokenByPassword: async ({mastodon_url, client_id, client_secret, username, password})=> {
    const api_url = mastodon_url + "/oauth/authorize";

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_id,
        client_secret,
        grant_type: "password",
        username,
        password,
      }),
    });

    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  __requestRevoke: async ({mastodon_url, client_id, client_secret})=> {
    const api_url = mastodon_url + "/oauth/revoke";

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_id,
        client_secret,
      }),
    });

    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },
}

export default APIUtil;