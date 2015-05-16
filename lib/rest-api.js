/**
 * lib/RestAPI.js
 *
 * The main file for the API manager.
 */

var Route = require('./route'),
	logger = require('./logger');

/**
 * Constructor. Takes in an Express app.
 */
function RestAPI(expressApp) {
	this.expressApp = expressApp;
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
 * @param {string} paramName The key to store the param result under in the url
 *   params object that gets passed to service functions, eg "user".
 *
 * @param {function} handler The handler function for the parameter. Should
 *   return a promise that resolves with (result, status).
 *
 * @return {object} this For chaining.
 */
RestAPI.prototype.param = function(paramString, paramName, handler) {
	this.expressApp.param(paramString, function(req, res, next, v) {
		handler(v)
		.then(function(result, status) {
			status = status || 200;

			if (status === 200) {
				req.urlParams[paramName] = result;

				next();
			} else {
				return res.respond({
					status: status,
					content: result
				});
			}
		})
		.catch(function(err) {
			logger.error(err);

			res.respond(500);
		});
	});
};

