const APIUtil = {
  requestApp: async ({mastodon_url, client_name, redirect_uris, scopes, website=""})=> {
    const api_url = mastodon_url + "/api/v1/apps";

    let response = await fetch(api_url, {
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

    // Returns {id, client_id, client_secret}
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  requestToken: async ({mastodon_url, client_id, client_secret, code, redirect_uri})=> {
    const api_url = mastodon_url + "/oauth/token";

    let response = await fetch(api_url, {
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

    // Returns {access_token, token_type, scope, created_at}
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  createAuthUrl: ({mastodon_url, client_id, redirect_uri})=> {
    const api_url = mastodon_url + "/oauth/authorize";

    let body = APIUtil.body({
      client_id,
      redirect_uri,
      response_type: "code",
    });

    return api_url + "/?" + body.toString();
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