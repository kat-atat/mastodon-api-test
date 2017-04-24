var Libodon = (function () {
    function Libodon(appname, redirect_url) {
        this.appname = appname;
        this.redirect_url = redirect_url;
        this.queryParam = window.location.search;
        this.connections = [];
    }
    Object.defineProperty(Libodon, "PREFIX", {
        get: function () {
            return "libodon";
        },
        enumerable: true,
        configurable: true
    });
    Libodon.prototype.connect = function (server) {
        var _this = this;
        var registration;
        var connection_resolve;
        var connection_reject;
        this.connections.push(new Promise(function (resolve, reject) {
            connection_resolve = resolve;
            connection_reject = reject;
        }));
        return this.get_registration(server)
            .then(function (reg) {
            registration = reg;
            return _this.get_token(server, reg);
        })
            .then(function (token) {
            connection_resolve({
                server: server,
                token: token
            });
            return { result: "success" };
        }, function (error) {
            connection_reject({ error: "failed connection" });
            return {
                result: "redirect",
                target: _this.get_authorization_url(server, registration)
            };
        });
    };
    Libodon.prototype.get_registration = function (server) {
        var registration = localStorage.getItem(Libodon.PREFIX + "_registration_" + server);
        if (registration === null || JSON.parse(registration).error) {
            return this.register_application(server)
                .then(function (reg) {
                localStorage.setItem(Libodon.PREFIX + "_registration_" + server, JSON.stringify(reg));
                return reg;
            });
        }
        else {
            return new Promise(function (resolve) { return resolve(JSON.parse(registration)); });
        }
    };
    Libodon.prototype.register_application = function (server) {
        var endpoint = server + "/api/v1/apps";
        var data = new URLSearchParams();
        data.set("response_type", "code");
        data.set("client_name", this.appname);
        data.set("redirect_uris", this.redirect_url);
        data.set("scopes", "read write follow");
        return fetch(endpoint, {
            method: "POST",
            mode: "cors",
            body: data
        })
            .then(function (res) { return res.json(); })
            .then(function (json) { return json; });
    };
    Libodon.prototype.get_token = function (server, registration) {
        var token = localStorage.getItem(Libodon.PREFIX + "_token_" + server);
        if (token === null || JSON.parse(token).error) {
            var re_match = /[?&]code=([^&]+)/.exec(this.queryParam);
            this.queryParam = "";
            if (!re_match) {
                throw ("no_token_or_code");
            }
            var code = re_match[1];
            var endpoint = server + "/oauth/token";
            var data = new URLSearchParams();
            data.set("grant_type", "authorization_code");
            data.set("client_id", registration.client_id);
            data.set("client_secret", registration.client_secret);
            data.set("redirect_uri", registration.redirect_uri);
            data.set("code", code);
            return fetch(endpoint, {
                method: "POST",
                mode: "cors",
                body: data
            })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                if (json.error === "invalid_grant") {
                    throw json.error;
                }
                localStorage.setItem(Libodon.PREFIX + "_token_" + server, JSON.stringify(json));
                return json;
            });
        }
        else {
            return new Promise(function (resolve) { return resolve(JSON.parse(token)); });
        }
    };
    Libodon.prototype.get_authorization_url = function (server, reg) {
        var endpoint = server + "/oauth/authorize?response_type=code";
        endpoint += "&client_id=" + reg.client_id;
        endpoint += "&redirect_uri=" + reg.redirect_uri;
        return endpoint;
    };
    Libodon.prototype.timeline = function (target, options) {
        var endpoint = "";
        var opt = this.timeline_options(options);
        switch (target) {
            case "home":
                endpoint = "/api/v1/timelines/home";
                break;
            case "mentions":
                endpoint = "/api/v1/timelines/mentions";
                break;
            case "public":
                if (options.local === true) {
                    opt += "&local=true";
                }
                endpoint = "/api/v1/timelines/public";
                break;
            default:
                if (target.substring(0, 1) === "#") {
                    if (options.local === true) {
                        opt += "&local=true";
                    }
                    endpoint =
                        "/api/v1/timelines/tag/" + target.substring(1);
                }
                break;
        }
        if (endpoint == "") {
            return new Promise(function (resolve, reject) { return reject({ error: "invalid timeline target" }); });
        }
        return this.get_request(endpoint + opt);
    };
    Libodon.prototype.timeline_options = function (options) {
        var params = [];
        if (options.max_id) {
            params.push("max_id=" + options.max_id);
        }
        if (options.since_id) {
            params.push("since_id=" + options.since_id);
        }
        if (options.limit) {
            params.push("limit=" + options.limit);
        }
        if (params.length) {
            return "?" + params.join("&");
        }
        return "";
    };
    Libodon.prototype.statuses = function (id) {
        return this.get_request("/api/v1/statuses/" + id);
    };
    Libodon.prototype.account = function (id) {
        return this.get_request("/api/v1/accounts/" + id);
    };
    Libodon.prototype.account_self = function () {
        return this.get_request("/api/v1/accounts/verify_credentials");
    };
    Libodon.prototype.account_statuses = function (id, options) {
        var opt = this.timeline_options(options);
        if (options.only_media === true) {
            opt += "&only_media=true";
        }
        if (options.exclude_replies === true) {
            opt += "&exclude_replies=true";
        }
        return this.get_request("/api/v1/accounts/" + id + "/statuses" + opt);
    };
    Libodon.prototype.followers = function (id) {
        return this.get_request("/api/v1/accounts/" + id + "/followers");
    };
    Libodon.prototype.relationships = function () {
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        if (!ids.length) {
            return new Promise(function (resolve, reject) { return reject({ error: "no id given" }); });
        }
        var query_parameters = "?";
        if (ids.length === 1) {
            query_parameters += "id=" + ids[0];
        }
        else {
            query_parameters += "id[]=" + ids.join("&id[]=");
        }
        return this.get_request("/api/v1/accounts/relationships" + query_parameters);
    };
    Libodon.prototype.suggestions = function () {
        return this.get_request("/api/v1/accounts/suggestions");
    };
    Libodon.prototype.context = function (id) {
        return this.get_request("/api/v1/statuses/" + id + "/context");
    };
    Libodon.prototype.reblogged_by = function (id) {
        return this.get_request("/api/v1/statuses/" + id + "/reblogged_by");
    };
    Libodon.prototype.favourited_by = function (id) {
        return this.get_request("/api/v1/statuses/" + id + "/favourited_by");
    };
    Libodon.prototype.follow_remote = function (url) {
        return this.post_request("/api/v1/follows", { uri: url });
    };
    Libodon.prototype.reblog = function (id) {
        return this.post_request("/api/v1/statuses/" + id + "/reblog");
    };
    Libodon.prototype.unreblog = function (id) {
        return this.post_request("/api/v1/statuses/" + id + "/unreblog");
    };
    Libodon.prototype.favourite = function (id) {
        return this.post_request("/api/v1/statuses/" + id + "/favourite");
    };
    Libodon.prototype.unfavourite = function (id) {
        return this.post_request("/api/v1/statuses/" + id + "/unfavourite");
    };
    Libodon.prototype.follow = function (id) {
        return this.post_request("/api/v1/accounts/" + id + "/follow");
    };
    Libodon.prototype.unfollow = function (id) {
        return this.post_request("/api/v1/accounts/" + id + "/unfollow");
    };
    Libodon.prototype.block = function (id) {
        return this.post_request("/api/v1/accounts/" + id + "/block");
    };
    Libodon.prototype.unblock = function (id) {
        return this.post_request("/api/v1/accounts/" + id + "/unblock");
    };
    Libodon.prototype.get_request = function (endpoint) {
        if (this.connections.length === 0) {
            return new Promise(function (resolve, reject) { return reject({ error: "not connected" }); });
        }
        // choose recent connected
        return this.connections[this.connections.length - 1]
            .then(function (conn) {
            if (!conn.token) {
                return new Promise(function (resolve, reject) { return reject({ error: "not connected" }); });
            }
            var fetchHeaders = new Headers();
            fetchHeaders.set("Authorization", "Bearer " + conn.token.access_token);
            return fetch(conn.server + endpoint, {
                method: "GET",
                mode: "cors",
                headers: fetchHeaders
            })
                .then(function (res) { return res.json(); })
                .then(function (json) { return json; });
        }, function (error) { return error; });
    };
    Libodon.prototype.post_request = function (endpoint, data) {
        if (this.connections.length === 0) {
            return new Promise(function (resolve, reject) { return reject({ error: "not connected" }); });
        }
        // choose recent connected
        return this.connections[this.connections.length - 1]
            .then(function (conn) {
            if (!conn.token) {
                return new Promise(function (resolve, reject) { return reject({ error: "not connected" }); });
            }
            var server = conn.server;
            var token = conn.token.access_token;
            var fetchHeaders = new Headers();
            fetchHeaders.set("Authorization", "Bearer " + token);
            var body = new URLSearchParams();
            for (var key in data)
                body.set(key, data[key]);
            return fetch(server + endpoint, {
                method: "POST",
                mode: "cors",
                headers: fetchHeaders,
                body: body
            }).then(function (res) { return res.json(); });
        });
    };
    Libodon.prototype.streaming_options = function (target, options) {
        var params = [];
        if (target === "public") {
            if (options.local === true) {
                params.push("stream=public:local");
            }
            else {
                params.push("stream=public");
            }
        }
        if (target === "user") {
            params.push("stream=user");
        }
        if (target.substring(0, 1) === "#") {
            params.push("stream=hashtag&tag=" + target.substring(1));
            if (options.local === true) {
                // TODO: support with {local: true}
            }
        }
        if (params.length === 0) {
            return new Promise(function (resolve, reject) {
                return reject({ error: "invalid streaming target" });
            });
        }
        return "?" + params.join("&");
    };
    Libodon.prototype.streaming = function (target, options) {
        var endpoint = "//api/v1/streaming/";
        var opt = this.streaming_options(target, options);
        return this.streaming_request(endpoint + opt);
    };
    Libodon.prototype.streaming_request = function (endpoint) {
        if (this.connections.length === 0) {
            return new Promise(function (resolve, reject) {
                return reject({ error: "not connected" });
            });
        }
        // choose recent connected
        return this.connections[this.connections.length - 1]
            .then(function (conn) {
            if (!conn.token) {
                return new Promise(function (resolve, reject) {
                    return reject({ error: "not connected" });
                });
            }
            var url = new URL(conn.server + endpoint);
            if (url.protocol === "https:") {
                url.protocol = "wss:";
            }
            else {
                url.protocol = "ws:";
            }
            url.search = [url.search, "access_token=" + conn.token.access_token].join("&");
            return new WebSocket(url.href);
        }, function (error) { return error; });
    };
    return Libodon;
}());
//# sourceMappingURL=Libodon.js.map
