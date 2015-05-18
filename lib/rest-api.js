/**
 * lib/RestAPI.js
 *
 * The main file for the API manager.
 */

var Route = require('./route'),
	logger = require('./logger'),
	responder = require('./responder'),
	bodyParser = require('body-parser'),
	q = require('q');

/**
 * Constructor. Takes in an Express app.
 */
function RestAPI(expressApp) {
	this.expressApp = expressApp;

	// add middleware
	this.expressApp.use(bodyParser.json({
		strict: true
	}));
	this.expressApp.use(responder);
}

/**
 * Route function. Returns a Route object with the given path, attached to this
 * RestAPI instance.
 *
 * @param {string} path The desired path for the route, eg '/user'.
 */
RestAPI.prototype.route = function(path) {
	return new Route(this, path);
};

/**
 * Param function. Adds a URL param handler to express using the given
 * function.
 *
 * @param {string} paramString The string to check the request path against, eg
 *	 "userId".
 *
 * @param {string} resultName The key to store the param result under in the url
 *   params object that gets passed to service functions, eg "user".
 *
 * @param {function} handler The handler function for the parameter. Should
 *   return a promise that resolves with (result, status).
 *
 * @return {object} this For chaining.
 */
RestAPI.prototype.param = function(paramString, resultName, handler) {
	this.expressApp.param(paramString, function(req, res, next, paramValue) {
		req.urlParams = req.urlParams || {};
		
		q.fcall(handler, paramValue)
		.then(function(result, status) {
			var status = 200,
				content = [],
				error = {},
				message = '';

			if (typeof result === 'number') {
				// allow the client to pass back an explicit status code
				status = result;
			} else if (typeof result === 'object') {
				// allow the client to explicitly construct a response by passing in
				// _status, _content, _error, or _message parameters
				status = result._status || status;
				content = result._content || result;
				error = result._error || error;
				message = result._message || message;
			}

			if (status === 200) {
				req.urlParams[resultName] = result;

				next();
			} else {
				return res.respond({
					status: status,
					content: content,
					error: error,
					message: message
				});
			}
		})
		.catch(function(err) {
			logger.error(err);

			res.respond(500);
		});
	});
};

module.exports = RestAPI;
