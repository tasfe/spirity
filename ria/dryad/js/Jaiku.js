// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Jaiku Api
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-09-04
 * @link   http://www.gracecode.com/
 */

~function() {
	var URI_API_REQUEST = "http://api.jaiku.com/json";
	var URI_REQUEST_TOKEN = "http://www.jaiku.com/api/request_token";
	var URI_AUTHORIZE = "http://www.jaiku.com/api/authorize";
	var URI_ACCESS_TOKEN = "http://www.jaiku.com/api/access_token";

	var API_KEY = "b6c167af47f84522bcaf3fcecab9b2f8";
	var API_KEY_SECRET = "7a0c45f31f59420599086f834d47dd97";

	var REQUEST_TOKEN = "";
	var REQUEST_TOKEN_SECRET = "";

	var ACCESS_TOKEN = "f6d7189235cf40dd96b10fac084f434e";
	var ACCESS_TOKEN_SECRET = "50984572a99d4e84a732145a188449e4";

	var SIGNATURE_METHOD = "HMAC-SHA1";

	var USER_NAME = 'mingcheng';

	/**
     * 根据参数发起请求
     */
	var newRequest = function(config) {
		var message = $merge({
			method: "POST",
			parameters: {
				oauth_consumer_key: API_KEY,
				oauth_token: ACCESS_TOKEN,
				oauth_signature_method: SIGNATURE_METHOD,
				oauth_signature: "",
				oauth_timestamp: "",
				oauth_nonce: ""
			}
		},
		config.message);

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, $merge({
			consumerSecret: API_KEY_SECRET,
			tokenSecret: ACCESS_TOKEN_SECRET
		},
		config.sign || {}));

		return new Request({
			url: message.action,
			method: message.method,
			data: OAuth.getParameterMap(message.parameters),
			onSuccess: (function(responseText) {
				alert(responseText);
			}),
			onFailure: function() {
				alert('onFailure');
			}
		}).send();
	};

	var Jaiku = new Class({
		initialize: function() {

		},

		auth: {
			/**
             * 获取本地已获取验证的 Token
             */
			getLocatinToken: function() {
				return {
					'request_token': REQUEST_TOKEN,
					'request_token_secret': REQUEST_TOKEN_SECRET,
					'access_token': ACCESS_TOKEN,
					'access_token_secret': ACCESS_TOKEN_SECRET
				};
			},

			/**
             * 根据 API_KEY 获取 RequestToken
             */
			getRequestToken: function() {
				var message = {
					method: 'GET',
					action: URI_REQUEST_TOKEN,
					parameters: {
						oauth_consumer_key: API_KEY,
						oauth_signature_method: SIGNATURE_METHOD,
						oauth_signature: "",
						oauth_timestamp: "",
						oauth_nonce: ""
					}
				};

				OAuth.setTimestampAndNonce(message);
				OAuth.SignatureMethod.sign(message, {
					consumerSecret: API_KEY_SECRET
				});

				var onSuccess = arguments[0].onSuccess || null;

				return new Request({
					method: message.method,
					url: message.action + '?' + new Hash(OAuth.getParameterMap(message.parameters)).toQueryString(),
					onSuccess: (function(responseText) {
						var responseObj = OAuth.getParameterMap(OAuth.decodeForm(responseText));
						REQUEST_TOKEN = responseObj.oauth_token
						REQUEST_TOKEN_SECRET = responseObj.oauth_token_secret
						if ($type(onSuccess) == 'function') {
							onSuccess.call(this);
						}
					}).bind(this),
					onFailure: function() {
						alert('getRequestToken failed');
					}
				}).send();
			},

			/**
             * 根据 getRequestToken 方法获取的 RequestToken 生成用户验证 URL
             */
			getUserAuthorizationURL: function(perms) {
				if (!REQUEST_TOKEN || ! REQUEST_TOKEN_SECRET) {
					return "";
				}

				return URI_AUTHORIZE + '?oauth_token=' + REQUEST_TOKEN + '&perms=' + (perms || 'delete');
			},

			/**
             * 当用户使用 getUserAuthorizationURL 访问验证完毕后，再获取 AccessToken
             */
			getAccessToken: function() {
				if (!REQUEST_TOKEN || ! REQUEST_TOKEN_SECRET) {
					return;
				}

				var message = {
					method: "GET",
					action: URI_ACCESS_TOKEN,
					parameters: {
						oauth_consumer_key: API_KEY,
						oauth_token: REQUEST_TOKEN,
						oauth_signature_method: SIGNATURE_METHOD,
						oauth_signature: "",
						oauth_timestamp: "",
						oauth_nonce: ""
					}
				};

				OAuth.setTimestampAndNonce(message);
				OAuth.SignatureMethod.sign(message, {
					consumerSecret: API_KEY_SECRET,
					tokenSecret: REQUEST_TOKEN_SECRET
				});

				return new Request({
					url: message.action + '?' + new Hash(OAuth.getParameterMap(message.parameters)).toQueryString(),
					method: message.method,
					onSuccess: (function(responseText) {
						try {
							var responseObj = OAuth.getParameterMap(OAuth.decodeForm(responseText));
							ACCESS_TOKEN = responseObj.oauth_token;
							ACCESS_TOKEN_SECRET = responseObj.oauth_token_secret;

							alert(ACCESS_TOKEN);
							alert(ACCESS_TOKEN_SECRET);
						} catch(e) {

						}
					}).bind(this),
					onFailure: function() {
						alert('getAccessToken failed');
					}
				}).send();
			}
		},

		explore: function() {
			var message = {
				method: "GET",
				action: 'http://www.jaiku.com/explore/json'
			};

			return newRequest({
				message: message
			});
		},

		contacts: function() {

		},

		presence: function() {},

		post: {
			post: function(parameters) {
				var message = {
					method: "POST",
					action: URI_API_REQUEST
				};
				message.parameters = $merge(message.parameters, $merge({
					method: "post",
					location: "Dryad",
					nick: USER_NAME,
					uuid: + new Date()
				},
				parameters));

				//...
				return newRequest({
					message: message
				});
			},

			del: function() {} // ft, no API yet :^(
		},

		entry: {
			get: function(username) {
				username = username || USER_NAME;
				var message = {
					method: "POST",
					action: "http://" + username + ".jaiku.com/json"
				};

				// ...
				return newRequest({
					message: message
				});
			},

			// @TODO
			addComment: function(parameters) {
				var message = {
					method: "POST",
					action: URI_API_REQUEST
				};

               /*
                * _task_ref - admin-only, task to resume
                * content - the text content of the comment
                * stream - the key to the stream in which the entry being commented on resides; example: stream/popular@example.com/presence
                * entry - the key to the parent entry associated with this comment; example: stream/popular@example.com/presence/12347
                * nick - the actor making the comment
                * uuid - optional; a unique identifier for this comment; if absent, a new one will be generated
                */
				message.parameters = $merge(message.parameters, $merge({
					method: "entry_add_comment",
					nick: USER_NAME
					/*
                    limit: 30,
                    since_time: '10/25/2008'
                    */
				},
				parameters));

				//...
				return newRequest({
					message: message
				});
			},

			getActorOverviewSince: function(parameters) {
				var message = {
					method: "POST",
					action: URI_API_REQUEST
				};
				message.parameters = $merge(message.parameters, $merge({
					method: "entry_get_actor_overview_since",
					nick: USER_NAME
					/*
                    limit: 30,
                    since_time: '10/25/2008'
                    */
				},
				parameters));

				//...
				return newRequest({
					message: message
				});
			},

			/**
             * // failed
             */
			getActorOverview: function(parameters) {
				var message = {
					method: "POST",
					action: URI_API_REQUEST
				};
				message.parameters = $merge(message.parameters, $merge({
					method: "entry_get_actor_overview",
					nick: USER_NAME
					/*
                    limit: 30,
                    offset: '10/25/2008'
                    */
				},
				parameters));

				//...
				return newRequest({
					message: message
				});
			}
		},

		actor: {
			get: function(parameters) {
				var message = {
					method: "POST",
					action: URI_API_REQUEST
				};
				message.parameters = $merge(message.parameters, $merge({
					method: "actor_get",
					nick: USER_NAME
				},
				parameters));

				//...
				return newRequest({
					message: message
				});
			},

			addContact: function() {

			},

			getContacts: function(username) {
				username = username || USER_NAME;
				var message = {
					method: "POST",
					action: "http://" + username + ".jaiku.com/contacts/json"
				};

				return newRequest({
					message: message
				});
			},

			addContactsAvatarsSince: function() {

			}
		}
	});

	window.Jaiku = new Jaiku({

	});
} ();
