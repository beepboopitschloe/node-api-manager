/**
 * server/modules/responder.js
 *
 * Module that defines the format of a response and adds a .respond() method
 * to response objects. res.respond(obj) will create a new Response from its
 * arguments and send that to the client.
 *
 * {
 *   status: Number,
 *   error: Object,
 *   message: String,
 *   content: Array || Object
 * }
 *
 */

var defaultErrors = {
  400: 'Required parameters were missing or invalid.',
  401: 'You are not authorized to perform that action.',
  404: 'Item not found.',
  500: 'Internal server error.'
}

function Response(obj) {
  if (typeof obj === 'number') {
    obj = {
      status: obj
    };
  } else if (typeof obj === 'undefined') {
    obj = {};
  } else if (typeof obj !== 'object') {
    throw new TypeError('Expected number, undefined, or object for Response, '
        + 'instead got ' + typeof obj);
  }

  if (obj.status && typeof obj.status !== 'number') {
    // crash if the client provides a non-number value
    throw new TypeError('Expected response.status to be a number, instead got '
      + obj.status
      + ' (' + typeof obj.status + ')');
  } else {
    // use the provided value or default to 200
    this.status = obj.status || 200;
  }

  // error can be either a string or an object.
  if (obj.error && typeof obj.error === 'string') {
    // if it is a string, we create an object to respond with
    this.error = {
      message: obj.error
    }
  } else if (typeof obj.error === 'object') {
    // if it is an object, we respond with that
    this.error = obj.error;

    // but make sure not to send back a stack trace
    if (this.error.stack) {
      delete this.error.stack;
    }
  } else if (obj.error) {
    // if it exists, but it's not a string or an object, that is a programming
    // error
    throw new TypeError('Expected string or object for response.error, '
        + 'instead got '
        + obj.error
        + ' (' + typeof obj.error + ')');
  }

  // message can only be a string.
  if (obj.message && typeof obj.message !== 'string') {
    throw new TypeError('Expected string for response.message, instead got '
        + typeof obj.message);
  } else {
    // default to empty string
    this.message = obj.message || '';
  }

  // content must be an array or an object.
  if (obj.content && typeof obj.content === 'object') {
    if (Array.isArray(obj.content)) {
      // if the value is an array, use that
      this.content = obj.content;
    } else {
      // if the provided value is an object, convert it to an array for the sake
      // of consistency.
      this.content = [obj.content];
    }
  } else if (obj.content) {
    // if content is provided but is not an object, that's a programmer error
    throw new TypeError('Expected array or object for response.content, '
        + 'instead got '
        + obj.content
        + ' (' + typeof obj.content + ')');
  } else {
    // default to empty array
    this.content = [];
  }

  this.length = this.content.length;

  if (defaultErrors[this.status] && (!this.error || !this.error.message)) {
    this.error = this.error || {};
    this.error.message = defaultErrors[this.status];
  }
}

function responder(req, res, next) {
  res.respond = function(obj) {
    var r = new Response(obj);

    res.status(r.status).jsonp(r);
  }

  next();
}

exports = module.exports = responder;
