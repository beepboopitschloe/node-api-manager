/**
 * route.js
 *
 * Defines the Route class, which provides wrapper methods around Express
 * routes.
 */

var Handler = require('./handler');

/**
 * Constructor. Takes in a RestAPI instance and a path for the route.
 */
function Route(restApi, path) {
	this.restApi = restApi;
	this.path = path;

	this.expressRoute = restApi.expressApp.route(path);
}

Route.prototype._addHandler = function(method, serviceFunction) {
	this.expressRoute[method](new Handler(serviceFunction));
}

/**
 * Define GET handlers for the route.
 */
Route.prototype.get = function(serviceFunction) {
	this._addHandler('get', serviceFunction);

	return this;
}

/**
 * Define PUT handlers for the route.
 */
Route.prototype.put = function(serviceFunction) {
	this._addHandler('put', serviceFunction);

	return this;
}

/**
 * Define POST handlers for the route.
 */
Route.prototype.post = function(serviceFunction) {
	this._addHandler('post', serviceFunction);

	return this;
}

/**
 * Define DELETE handlers for the route.
 */
Route.prototype.delete = function(serviceFunction) {
	this._addHandler('delete', serviceFunction);

	return this;
}

module.exports = Route;

