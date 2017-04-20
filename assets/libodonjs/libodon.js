var Libodon = (function () {
    function Libodon(appname, redirect_url) {
        this.appname = appname;
        this.redirect_url = redirect_url;
        this.connections = [];
    }
    Object.defineProperty(Libodon, "PREFIX", {
        get: function () {
            return "libodon";
        },
        enumerable: true,
        configurable: true
    });
    Libodon.prototype.connect = function (server, user_email) {
        var _this = this;
        var connection_resolve;
        var connection_reject;
        var registration;
        var promise = new Promise(function (resolve, reject) {
            connection_resolve = resolve;
            connection_reject = reject;
        });
        this.connections.push(promise);
        return this.get_registration(server, this.appname, this.redirect_url)
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
            connection_reject(new Error("failed connection"));
            _this.connections = _this.connections.filter(function (con) { return con !== promise; });
            return {
                result: "redirect",
                target: _this.get_authorization_url(server, registration)
            };
        });
    };
    Libodon.prototype.get_registration = function (server, appname, redirect_url) {
        var registration = localStorage.getItem(Libodon.PREFIX + "_registration_" + server);
        if (typeof registration !== "string") {
            return this.register_application(server, appname, redirect_url)
                .then(function (reg) {
                localStorage.setItem(Libodon.PREFIX + "_registration_" + server, JSON.stringify(registration));
                return reg;
            });
        }
        else {
            return new Promise(function (resolve) { return resolve(JSON.stringify(registration)); });
        }
    };
    Libodon.prototype.register_application = function (server, appname, redirect_url) {
        var endpoint = server + "/api/v1/apps";
        var data = new URLSearchParams();
        data.set("response_type", "code");
        data.set("client_name", appname);
        data.set("redirect_uris", redirect_url);
        data.set("scopes", "read write follow");
        return fetch(endpoint, {
            method: "POST",
            mode: "cors",
            body: data
        })
            .then(function (res) { return res.json(); })
            .then(function (reg) { return reg; });
    };
    Libodon.prototype.get_token = function (server, registration) {
        var token = localStorage.getItem(Libodon.PREFIX + "_token_" + server);
        if (typeof token !== "string") {
            var re_match = /[?&]code=([^&]+)/
                .exec(window.location.search);
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
        switch (target) {
            case "home":
                endpoint = "/api/v1/timelines/home";
                break;
            case "mentions":
                endpoint = "/api/v1/timelines/mentions";
                break;
            case "public":
                endpoint = "/api/v1/timelines/public";
                break;
            default:
                if (target.substring(0, 1) === "#") {
                    endpoint =
                        "/api/v1/timelines/tag/" + target.substring(1);
                }
                break;
        }
        if (endpoint == "") {
            return new Promise(function (resolve, reject) { return reject(new Error("invalid timeline target")); });
        }
        return this.get_request(endpoint + this.timeline_options(options));
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
        if (options.local === true) {
            /**
             *  local (optional; public and tag timelines only): Only return statuses originating from this instance
             *  https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#timelines
             */
            params.push("local=true");
        }
        if (params.length) {
            return "?" + params.join("&");
        }
        return "";
    };
    Libodon.prototype.get_request = function (endpoint) {
        if (this.connections.length === 0) {
            return new Promise(function (resolve, reject) { return reject(new Error("not connected")); });
        }
        // choose recent connected
        return this.connections[this.connections.length - 1]
            .then(function (conn) {
            if (!conn.token) {
                return new Promise(function (resolve, reject) { return reject(new Error("not connected")); });
            }
            var fetchHeaders = new Headers();
            fetchHeaders.set("Authorization", "Bearer " + conn.token.access_token);
            return fetch(conn.server + endpoint, {
                method: "GET",
                mode: "cors",
                headers: fetchHeaders
            })
                .then(function (res) { return res.json(); });
        });
    };
    return Libodon;
}());
