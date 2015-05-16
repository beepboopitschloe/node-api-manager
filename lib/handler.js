/**
 * handler.js
 *
 * Defines a route handler.
 */

var logger = require('./logger');

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

		if (req.method === 'get') {
			// if the request is a GET request, treat the query object as the body
			body = req.query;
		} else {
			body = req.body;
		}

		serviceFunction(body, urlParams)
		.then(function(result, status) {
			res.respond({
				status: status || 200,
				content: result	
			});

			return status;
		})
		.catch(function(err) {
			logger.error(req.method, req.path, 'ERROR:', err.stack);

			res.respond(500);

			return 500;
		})
		.finally(function(status) {
			// whether the request succeeds or fails, log how long it took to process
			var responseTime = (new Date() - startTime).getTime();
			logger.log(req.method, req.path, 'resolved to', status, 'in',
					(endTime - startTime) + 'ms');
		});
	}
}
