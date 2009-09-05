// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Jaiku Api
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-09-04
 * @link   http://www.gracecode.com/
 */

~function() {
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

	var xhr = new Request();

	var Jaiku = new Class({
		initialize: function() {

		},

		auth: {
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
						alert('onFailure');
					},
                    noCache: true
				}).send();
			},

			getUserAuthorizationURL: function(perms) {
				if (!REQUEST_TOKEN || ! REQUEST_TOKEN_SECRET) {
					return;
				}

				return URI_AUTHORIZE + '?oauth_token=' + REQUEST_TOKEN + '&perms=' + (perms || 'delete');
			},

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
							ACCESS_TOKEN_SECRET = responseObj.oauth_token_secret

                            alert(ACCESS_TOKEN);
                            alert(ACCESS_TOKEN_SECRET);
						} catch(e) {

						}
					}).bind(this),
                    onFailure: function() {},
                    noCache: true
				}).send();
			}
		},

		explore: function() {

		},

		contacts: function() {

		},

		presence: function() {},

		post: {
			post: function() {},

			del: function() {}
		},

		entry: {
			get: function() {},
			addComment: function() {},
			getActorOverviewSince: function() {},
			getActorOverview: function() {}
		},

		actor: {
			get: function() {},
			addContact: function() {},
			addContactsAvatarsSince: function() {}
		}
	});

	window.Jaiku = new Jaiku;
} ();

