const APIUtil = {

  // returns {name, website, client_id, client_secret, id, redirect_uri} || {error}
  // reference from https://docs.joinmastodon.org/api/rest/apps/#post-api-v1-apps
  requestApp: async ({mastodon_url, client_name, redirect_uris, scopes, website=null})=> {
    const api_url = mastodon_url + "/api/v1/apps";

    let request = new Request(api_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams({
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

  // returns {access_token, created_at, scope, token_type} || {error}
  // reference from https://docs.joinmastodon.org/api/authentication/#post-oauth-token
  requestToken: async ({mastodon_url, client_id, client_secret, code, redirect_uri})=> {
    const api_url = mastodon_url + "/oauth/token";

    let request = new Request(api_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams({
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

  // returns {void}
  // reference from https://docs.joinmastodon.org/api/authentication/#post-oauth-revoke
  requestRevoke: async ({mastodon_url, client_id, client_secret})=> {
    const api_url = mastodon_url + "/oauth/revoke";

    let request = new Request(api_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams({
        client_id,
        client_secret,
      }),
    });

    let response = await fetch(request);
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },

  // create auth link url
  // returns {URL}
  // reference from https://docs.joinmastodon.org/api/authentication/#get-oauth-authorize
  createAuthUrl: ({mastodon_url, client_id, redirect_uri})=> {
    const url = new URL(mastodon_url + "/oauth/authorize");

    const s = url.searchParams;
    s.set("client_id", client_id);
    s.set("redirect_uri", redirect_uri);
    s.set("response_type", "code");

    return url;
  },

  onresponsed: (responsed)=> {},

  __requestTokenByPassword: async ({mastodon_url, client_id, client_secret, username, password})=> {
    const api_url = mastodon_url + "/oauth/authorize";

    let request = new Request(api_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "password",
        username,
        password,
      }),
    });

    let response = await fetch(request);
    let json = await response.json();
    APIUtil.onresponsed(json);

    return json;
  },
}


export default APIUtil;