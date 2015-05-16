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

Route.prototype._addHandler = function(method) {
	// all arguments after 'method' should be a function handler
	var funcs = Array.prototype.slice.call(arguments, 1);

	this.expressRoute[method](new Handler(funcs));
}

/**
 * Define GET handlers for the route.
 */
Route.prototype.get = function() {
	var callWith = ['get'].concat(Array.prototype.slice.call(arguments));

	this._addHandler.apply(this, callWith);

	return this;
}

/**
 * Define PUT handlers for the route.
 */
Route.prototype.put = function() {
	var callWith = ['put'].concat(Array.protoype.slice.call(arguments));

	this._addHandler.apply(this, callWith);

	return this;
}

/**
 * Define POST handlers for the route.
 */
Route.prototype.post = function() {
	var callWith = ['post'].concat(Array.protoype.slice.call(arguments));

	this._addHandler.apply(this, callWith);

	return this;
}

/**
 * Define DELETE handlers for the route.
 */
Route.prototype.delete = function() {
	var callWith = ['delete'].concat(Array.protoype.slice.call(arguments));

	this._addHandler.apply(this, callWith);

	return this;
}

module.exports = Route;

