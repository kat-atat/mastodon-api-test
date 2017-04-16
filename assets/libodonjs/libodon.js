'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Libodon = function () {
		function Libodon(appname, redirect_url) {
			_classCallCheck(this, Libodon);

			this.appname = appname;
			this.redirect_url = redirect_url;
		}

		_createClass(Libodon, [{
			key: 'connect',
			value: function connect(server, username) {
				var connection_resolve = void 0,
				    connection_reject = void 0,
				    registration = void 0;
				connections.push(new Promise(function (resolve, reject) {
					connection_resolve = resolve;
					connection_reject = reject;
				}));
				active_connection = connections.length - 1;
				return get_registration(server, this.appname, this.redirect_url).then(function (reg) {
					registration = reg;
					return get_token(server, reg);
				}).then(function (token) {
					connection_resolve({ server: server, token: token });
					return { result: 'success' };
				}, function (error) {
					active_connection = undefined;
					connection_reject({ error: 'failed connection' });
					return { result: 'redirect', target: get_authorization_url(server, registration) };
				});
			}
		}, {
			key: 'timeline',
			value: function timeline(target, options) {
				var endpoint = '';
				switch (target) {
					case 'home':
						endpoint = '/api/v1/timelines/home';break;
					case 'mentions':
						endpoint = '/api/v1/timelines/mentions';break;
					case 'public':
						endpoint = '/api/v1/timelines/public';break;
					default:
						if (target.substring(0, 1) == '#') endpoint = '/api/v1/timelines/tag/' + target.substring(1);
						break;
				}
				if (endpoint == '') return Promise.reject('invalid timeline target');
				return get_request(endpoint + timeline_options(options));
			}
		}, {
			key: 'status',
			value: function status(id) {
				return get_request('/api/v1/statuses/' + id);
			}
		}, {
			key: 'account',
			value: function account(id) {
				return get_request('/api/v1/accounts/' + id);
			}
		}, {
			key: 'account_self',
			value: function account_self() {
				return get_request('/api/v1/accounts/verify_credentials');
			}
		}, {
			key: 'account_statuses',
			value: function account_statuses(id, options) {
				return get_request('/api/v1/accounts/' + id + '/statuses' + timeline_options(options));
			}
		}, {
			key: 'followers',
			value: function followers(id) {
				return get_request('/api/v1/accounts/' + id + '/followers');
			}
		}, {
			key: 'relationships',
			value: function relationships() {
				for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
					ids[_key] = arguments[_key];
				}

				if (!ids.length) return Promise.reject('no id given');
				var query_parameters = '?';
				if (ids.length == 1) query_parameters += 'id=' + ids[0];else query_parameters += 'id[]=' + ids.join('&id[]=');
				return get_request('/api/v1/accounts/relationships' + query_parameters);
			}
		}, {
			key: 'suggestions',
			value: function suggestions() {
				return get_request('/api/v1/accounts/suggestions');
			}
		}, {
			key: 'context',
			value: function context(id) {
				return get_request('/api/v1/statuses/' + id + '/context');
			}
		}, {
			key: 'reblogged_by',
			value: function reblogged_by(id) {
				return get_request('/api/v1/statuses/' + id + '/reblogged_by');
			}
		}, {
			key: 'favourited_by',
			value: function favourited_by(id) {
				return get_request('/api/v1/statuses/' + id + '/favourited_by');
			}
		}, {
			key: 'follow_remote',
			value: function follow_remote(url) {
				return post_request('/api/v1/follows', { uri: url });
			}
		}, {
			key: 'reblog',
			value: function reblog(id) {
				return post_request('/api/v1/statuses/' + id + '/reblog');
			}
		}, {
			key: 'unreblog',
			value: function unreblog(id) {
				return post_request('/api/v1/statuses/' + id + '/unreblog');
			}
		}, {
			key: 'favourite',
			value: function favourite(id) {
				return post_request('/api/v1/statuses/' + id + '/favourite');
			}
		}, {
			key: 'unfavourite',
			value: function unfavourite(id) {
				return post_request('/api/v1/statuses/' + id + '/unfavourite');
			}
		}, {
			key: 'follow',
			value: function follow(id) {
				return post_request('/api/v1/accounts/' + id + '/follow');
			}
		}, {
			key: 'unfollow',
			value: function unfollow(id) {
				return post_request('/api/v1/accounts/' + id + '/unfollow');
			}
		}, {
			key: 'block',
			value: function block(id) {
				return post_request('/api/v1/accounts/' + id + '/block');
			}
		}, {
			key: 'unblock',
			value: function unblock(id) {
				return post_request('/api/v1/accounts/' + id + '/unblock');
			}
		}]);

		return Libodon;
	}();

	this.Libodon = Libodon;

	var connections = [];
	var active_connection = undefined;

	var prefix = 'libodon';
	var log_errors = true;
	var log_actions = true;

	function timeline_options(options) {
		if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) == 'object') {
			var params = [];
			if (options.max_id) params.push('max_id=' + options.max_id);
			if (options.since_id) params.push('since_id=' + options.since_id);
			if (options.limit) params.push('limit=' + options.limit);
			if (params.length) return '?' + params.join('&');
		}
		return '';
	}

	function get_request(endpoint) {
		if (connections.length == 0 || typeof active_connection == 'undefined' || typeof connections[active_connection] == 'undefined') {
			return Promise.reject('not connected');
		}
		return connections[active_connection].then(function (conn) {
			if (conn.error) return Promise.reject('not connected');
			var server = conn.server;
			var token = conn.token.access_token;
			var fetchHeaders = new Headers();
			fetchHeaders.set('Authorization', 'Bearer ' + token);
			var fetchInit = {
				method: 'GET',
				mode: 'cors',
				headers: fetchHeaders
			};
			return fetch(server + endpoint, fetchInit).then(function (res) {
				return res.json();
			});
		});
	}

	function post_request(endpoint, data) {
		if (connections.length == 0 || typeof active_connection == 'undefined' || typeof connections[active_connection] == 'undefined') {
			return Promise.reject('not connected');
		}
		return connections[active_connection].then(function (conn) {
			if (conn.error) return Promise.reject('not connected');
			var server = conn.server;
			var token = conn.token.access_token;
			var fetchHeaders = new Headers();
			fetchHeaders.set('Authorization', 'Bearer ' + token);
			var body = new URLSearchParams();
			for (var key in data) {
				body.set(key, data[key]);
			}var fetchInit = {
				method: 'POST',
				mode: 'cors',
				headers: fetchHeaders,
				body: body
			};
			return fetch(server + endpoint, fetchInit).then(function (res) {
				return res.json();
			});
		});
	}

	function get_token(server, registration) {
		var token = localStorage.getItem(prefix + '_token_' + server);
		if (typeof token != 'string') {
			var re_match = /[?&]code=([^&]+)/.exec(window.location.search);
			if (!re_match) {
				if (log_errors) console.error("Failed to find token in storage & no code found in URL parameters.");
				throw 'no_token_or_code';
			}
			if (log_actions) console.log('fetching new token');
			var code = re_match[1];
			var endpoint = server + '/oauth/token';
			var data = new URLSearchParams();
			data.set('grant_type', 'authorization_code');
			data.set('client_id', registration.client_id);
			data.set('client_secret', registration.client_secret);
			data.set('redirect_uri', registration.redirect_uri);
			data.set('code', code);
			var fetchInit = {
				method: 'POST',
				mode: 'cors',
				body: data
			};
			return fetch(endpoint, fetchInit).then(function (res) {
				return res.json();
			}).then(function (obj) {
				if (obj.error == 'invalid_grant') {
					if (log_errors) console.error(obj.error_description);
					throw obj.error;
				}
				localStorage.setItem(prefix + '_token_' + server, JSON.stringify(obj));
				return obj;
			});
		} else {
			if (log_actions) console.log('reading token from storage');
			return new Promise(function (resolve) {
				return resolve(JSON.parse(token));
			});
		}
	}

	function get_authorization_url(server, registration) {
		var endpoint = server + '/oauth/authorize?response_type=code';
		endpoint += '&client_id=' + registration.client_id;
		endpoint += '&redirect_uri=' + registration.redirect_uri;
		return endpoint;
	}

	function get_registration(server, appname, redirect_url) {
		var reg = localStorage.getItem(prefix + '_registration_' + server);
		if (typeof reg != 'string') {
			if (log_actions) console.log('registering new app');
			var promise = register_application(server, appname, redirect_url);
			return promise.then(function (reg) {
				localStorage.setItem(prefix + '_registration_' + server, JSON.stringify(reg));
				return reg;
			});
		} else {
			if (log_actions) console.log('reading registration from storage');
			return new Promise(function (resolve) {
				return resolve(JSON.parse(reg));
			});
		}
	}

	function register_application(server, appname, redirect_url) {
		var endpoint = server + '/api/v1/apps';
		var data = new URLSearchParams();
		data.set('response_type', 'code');
		data.set('client_name', appname);
		data.set('redirect_uris', redirect_url);
		var fetchInit = {
			method: 'POST',
			mode: 'cors',
			body: data
		};
		return fetch(endpoint, fetchInit).then(function (res) {
			return res.json();
		});
	}