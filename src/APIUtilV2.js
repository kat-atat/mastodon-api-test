const APIUtilV2 = {
  url: (mastodon_url)=> ({
    app: async ({client_name, redirect_uris, scopes, website=""})=> {
      const api_url = new URL(mastodon_url + "/api/v1/apps");
  
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

      return await APIUtilV2.handleRequest(request);
    },
  
    token: async ({client_id, client_secret, code, redirect_uri})=> {
      const api_url = new URL(mastodon_url + "/oauth/token");
  
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

      return await APIUtilV2.handleRequest(request);
    },
  
    revoke: async ({client_id, client_secret})=> {
      const api_url = new URL(mastodon_url + "/oauth/revoke");
  
      let request = new Request(api_url, {
        method: "POST",
        mode: "cors",
        body: new URLSearchParams({
          client_id,
          client_secret,
        }),
      });

      return await APIUtilV2.handleRequest(request);
    },

    authLink: ({client_id, redirect_uri})=> {
      const url = new URL(mastodon_url + "/oauth/authorize");
  
      const s = url.searchParams;
      s.set("client_id", client_id);
      s.set("redirect_uri", redirect_uri);
      s.set("response_type", "code");
  
      return url;
    },

    account: ()=> {
      return {
        self: async ({access_token})=> {
          const api_url = new URL(mastodon_url + "/api/v1/accounts/verify_credentials");
          const request = new Request(api_url, {
            method: "GET",
            mode: "cors",
            headers: {Authorization: `Bearer ${access_token}`},
          });

          return await APIUtilV2.handleRequest(request);
        },
      }
    },
    
    timeline: ({max_id="", since_id="", min_id="", limit=32}={})=> {
      const searchParams = new URLSearchParams();
      searchParams.append("max_id", max_id);
      searchParams.append("since_id", since_id);
      searchParams.append("min_id", min_id);
      searchParams.append("limit", limit);
      return {
        home: async ({access_token})=> {
          const api_url = new URL(mastodon_url + "/api/v1/timelines/home");
          api_url.search = searchParams;
          const request = new Request(api_url, {
            method: "GET",
            mode: "cors",
            headers: {Authorization: `Bearer ${access_token}`},
          });
      
          return await APIUtilV2.handleRequest(request);
        },

        federated: async ({only_media=false}={})=> {
          const api_url = new URL(mastodon_url + "/api/v1/timelines/public");
          searchParams.append("local", "false");
          searchParams.append("only_media", only_media);
          api_url.search = searchParams;
          const request = new Request(api_url, {method: "GET", mode: "cors"});

          return await APIUtilV2.handleRequest(request);
        },

        local: async ({only_media=false}={})=> {
          const api_url = new URL(mastodon_url + "/api/v1/timelines/public");
          searchParams.append("local", "true");
          searchParams.append("only_media", only_media);
          api_url.search = searchParams;
          const request = new Request(api_url, {method: "GET", mode: "cors"});

          return await APIUtilV2.handleRequest(request);
        },
      };
    },
  }),

  handleRequest: async (request)=> {
    let response = await fetch(request);
    let json = await response.json();
    APIUtilV2.onresponsed(json);
    return json;
  },

  onresponsed: (responsed)=> {},
}

export default APIUtilV2;