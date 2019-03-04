const APIUtil = {
  getAuthCode: (url)=> {
    return new URL(url).searchParams.get("code");
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

  requestApp: async ({mastodon_url, client_name, redirect_uris, scopes, website=""})=> {
    const api_url = mastodon_url + "/api/v1/apps";
    const body = new URLSearchParams();

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body: APIUtil.body({
        client_name,
        redirect_uris,
        scopes,
        website,
        response_type: "code",
      }),
    });

    // Returns {id, client_id, client_secret}
    let json = await response.json();
    APIUtil.onresponsed(json);
    return json;
  },

  createAuthUrl: ({mastodon_url, client_id, redirect_uri, scopes})=> {
    let url = new URL(mastodon_url + "/oauth/authorize");
    let body = APIUtil.body({
      client_id,
      redirect_uri,
      response_type: "code",
      // scopes,
    });
    return url + "/?" + body.toString();
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
    const body = new URLSearchParams();
    body.set("client_id", client_id);
    body.set("client_secret", client_secret);
    body.set("grant_type", "password");
    body.set("username", username);
    body.set("password", password);

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body,
    });

    APIUtil.onresponse(response);

    let json = await response.json();
    return json.access_token;
  },

  __requestRevoke: async ()=> {
    const api_url = "/oauth/revoke";
    const body = new URLSearchParams();
    body.set("client_id", "");
    body.set("client_secret", "");
    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body,
    });

    APIUtil.onresponse(response);

    let json = await response.json();
  },
}

export default APIUtil;