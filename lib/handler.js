/**
 * handler.js
 *
 * Defines a route handler.
 */

var logger = require('./logger'),
	q = require('q');

/**
 * Constructor. Takes in a list of functions to be run when this route is
 * called. Returns a (req, res, next) handler function.
 */
function Handler(serviceFunction) {
	return function(req, res) {
		var startTime = new Date();

		logger.log(req.method, req.path);

		// pass the request body into the service function
		// @TODO need to pass in URL parameters as well
		var body = {},
			urlParams = {};

		if (req.method === 'GET') {
			// if the request is a GET request, treat the query object as the body
			body = req.query;
		} else {
			body = req.body;
		}

		q.fcall(serviceFunction, body, urlParams)
		.then(function(result) {
			var status = 200,
				content = [],
				error = {},
				message = '';

			if (typeof result === 'number') {
				// if a number comes back, treat it as a status code
				status = result;
			} else if (typeof result === 'object') {
				// allow the client to explicitly construct a response by passing in
				// _status, _content, _error, or _message parameters
				status = result._status || status;
				content = result._content || result;
				error = result._error || {};
				message = result._message || '';
			}

			res.respond({
				status: status,
				content: content,
				error: error
			});

			logger.log(req.method, req.path, 'resolved to', status, 'in',
					(new Date() - startTime) + 'ms');
		})
		.catch(function(err) {
			var status = 500;

			logger.error(req.method, req.path, 'ERROR:', err.stack);

			res.respond(status);

			logger.log(req.method, req.path, 'resolved to', status, 'in',
					(new Date() - startTime) + 'ms');
		});
	}
}

module.exports = Handler;
