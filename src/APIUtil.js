/**
 * usage
 **

const registerDetail = {
  id: localStorage.getItem("ID"),
  client_id: localStorage.getItem("CLIENT_ID"),
  client_secret: localStorage.getItem("CLIENT_SECRET"),

  access_token: localStorage.getItem("ACCESS_TOKEN"),
  client_id: localStorage.getItem("TOKEN_TYPE"),
  scope: localStorage.getItem("SCOPE"),
  created_at: localStorage.getItem("CREATED_AT"),
}

const appDetail = {
  client_name: "any-app mastodon",
  website: "any-app.com",
  scopes: "read write follow",
}

const sessionDetail = {}
let mastodon_url = "https://mastodon.com";
let redirect_uri = "https://any-app.com/app";
let pendingAuth = APIUtil.getPendingAuth(document.location);

if (pendingAuth !== null) {
  APIUtil.requestToken({
    ...pendingAuth,
    // redirect_uri,
  })
  .then(({access_token, token_type, scope, created_at})=> {
    localStorage.setItem("ACCESS_TOKEN", access_token);
    localStorage.setItem("TOKEN_TYPE", client_id);
    localStorage.setItem("SCOPE", scope);
    localStorage.setItem("CREATED_AT", created_at);
  });
}
else {
  APIUtil.requestApp({
    mastodon_url,
    redirect_uris: redirect_uri,
    ...appDetail,
  })
  .then(({id, client_id, client_secret})=> {
    localStorage.setItem("ID", id);
    localStorage.setItem("CLIENT_ID", client_id);
    localStorage.setItem("CLIENT_SECRET", client_secret);

    const auth_url = APIUtil.createAuthUrl({
      mastodon_url,
      client_id,
      redirect_uri,
      scopes: appDetail.scopes,
    });
    window.location.href = auth_url;
  });
}

**/

const APIUtil = {
  getPendingAuth: (url)=> {
    let params = new URL(url).searchParams;
    return params.has("code")
    && params.has("mastodon_url")
    && params.has("client_id")
    && params.has("client_secret")
    ? {
      code: params.get("code"),
      mastodon_url: params.get("mastodon_url"),
      client_id: params.get("client_id"),
      client_secret: params.get("client_secret"),
    }
    : null;
  },

  requestToken: async ({mastodon_url, client_id, client_secret, code})=> {
    const api_url = mastodon_url + "/oauth/token";
    const body = new URLSearchParams();
    body.set("client_id", client_id);
    body.set("client_secret", client_secret);
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    // body.set("redirect_uris", redirect_uris);

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body,
    });

    APIUtil.onresponse(response);

    // Returns {access_token, token_type, scope, created_at}
    let json = await response.json();
    return json;
  },

  requestApp: async ({mastodon_url, client_name, redirect_uris, scopes, website=""})=> {
    const api_url = mastodon_url + "/api/v1/apps";
    const body = new URLSearchParams();
    body.set("client_name", client_name);
    body.set("redirect_uris", redirect_uris);
    body.set("scopes", scopes);
    body.set("website", website);
    // body.set("response_type", "code");

    let response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body,
    });

    APIUtil.onresponse(response);

    // Returns {id, client_id, client_secret}
    let json = await response.json();
    return json;
  },

  createAuthUrl: ({mastodon_url, client_id, redirect_uri, scopes})=> {
    let url = new URL(mastodon_url + "/oauth/authorize");
    url.searchParams.set("client_id", client_id);
    url.searchParams.set("redirect_uri", redirect_uri);
    url.searchParams.set("response_type", "code");
    // url.searchParams.set("scope", scopes);
    return url;
  },

  onresponse: (response)=> {},

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