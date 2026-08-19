const logger = console;
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @api private
 */

var { METHODS } = require('node:http');
var contentType = require('content-type');
var etag = require('etag');
var mime = require('mime-types')
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('node:querystring');
const { Buffer } = require('node:buffer');


/**
 * A list of lowercased HTTP methods that are supported by Node.js.
 * @api private
 */
exports.methods = METHODS.map((method) => method.toLowerCase());

/**
 * Return strong ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.etag = createETagGenerator({ weak: false })

/**
 * Return weak ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.wetag = createETagGenerator({ weak: true })

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type){
logger.debug(`>>> Entering normalizeType(type=${type})`);
logger.debug(`<<< Exiting normalizeType(type=${type})`);
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: (mime.lookup(type) || 'application/octet-stream'), params: {} }
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types) {
logger.debug(`>>> Entering normalizeTypes(types=${types})`);
logger.debug(`<<< Exiting normalizeTypes(types=${types})`);
logger.debug(`>>> Entering acceptParams(str=${str})`);
logger.debug(`<<< Exiting acceptParams(str=${str})`);
  return types.map(exports.normalizeType);
};


/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams (str) {
  var length = str.length;
  var colonIndex = str.indexOf(';');
  var index = colonIndex === -1 ? length : colonIndex;
  var ret = { value: str.slice(0, index).trim(), quality: 1, params: {} };
logger.debug(`acceptParams(str=${str}): ret → ${ret}`);

  while (index < length) {
    var splitIndex = str.indexOf('=', index);
	logger.debug(`acceptParams(str=${str}): splitIndex → ${splitIndex}`);
    if (splitIndex === -1) break;

    var colonIndex = str.indexOf(';', index);
	logger.debug(`acceptParams(str=${str}): colonIndex → ${colonIndex}`);
    var endIndex = colonIndex === -1 ? length : colonIndex;

    if (splitIndex > endIndex) {
      index = str.lastIndexOf(';', splitIndex - 1) + 1;
      continue;
    }

    var key = str.slice(index, splitIndex).trim();
	logger.warn(`acceptParams(str=${str}): key → ${key}`);
    var value = str.slice(splitIndex + 1, endIndex).trim();
	logger.debug(`acceptParams(str=${str}): value → ${value}`);

    if (key === 'q') {
      ret.quality = parseFloat(value);
    } else {
      ret.params[key] = value;
    }

    index = endIndex + 1;
  }

  return ret;
}

/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileETag = function(val) {
logger.debug(`>>> Entering compileETag(val=${val})`);
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'weak':
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    default:
logger.debug(`<<< Exiting compileETag(val=${val})`);
      throw new TypeError('unknown value for etag function: ' + val);
  }

  return fn;
}

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileQueryParser = function compileQueryParser(val) {
logger.debug(`>>> Entering compileQueryParser(val=${val})`);
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'simple':
      fn = querystring.parse;
      break;
    case false:
      break;
    case 'extended':
      fn = parseExtendedQueryString;
      break;
    default:
logger.debug(`<<< Exiting compileQueryParser(val=${val})`);
      throw new TypeError('unknown value for query parser function: ' + val);
  }

  return fn;
}

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

exports.compileTrust = function(val) {
logger.debug(`>>> Entering compileTrust(val=${val})`);
  if (typeof val === 'function') return val;

  if (val === true) {
    // Support plain true/false
    return function(){ return true };
  }

  if (typeof val === 'number') {
    // Support trusting hop count
    return function(a, i){ return i < val };
  }

  if (typeof val === 'string') {
    // Support comma-separated values
    val = val.split(',')
      .map(function (v) { return v.trim() })
  }

logger.debug(`<<< Exiting compileTrust(val=${val})`);
  return proxyaddr.compile(val || []);
}

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */

exports.setCharset = function setCharset(type, charset) {
logger.debug(`>>> Entering setCharset(type=${type},charset=${charset})`);
  if (!type || !charset) {
    return type;
  }

  // parse type
  var parsed = contentType.parse(type);
logger.debug(`setCharset(type=${type},charset=${charset}): parsed → ${parsed}`);

  // set charset
  parsed.parameters.charset = charset;

  // format type
logger.debug(`<<< Exiting setCharset(type=${type},charset=${charset})`);
  return contentType.format(parsed);
};

/**
 * Create an ETag generator function, generating ETags with
 * the given options.
 *
 * @param {object} options
 * @return {function}
 * @private
 */

function createETagGenerator (options) {
logger.debug(`>>> Entering createETagGenerator(options=${options})`);
  return function generateETag (body, encoding) {
logger.debug(`>>> Entering generateETag(body=${body},encoding=${encoding})`);
    var buf = !Buffer.isBuffer(body)
      ? Buffer.from(body, encoding)
      : body
	logger.debug(`<<< Exiting generateETag(body=${body},encoding=${encoding})`);

logger.debug(`<<< Exiting createETagGenerator(options=${options})`);
    return etag(buf, options)
  }
}

/**
 * Parse an extended query string with qs.
 *
 * @param {String} str
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
logger.debug(`>>> Entering parseExtendedQueryString(str=${str})`);
logger.debug(`<<< Exiting parseExtendedQueryString(str=${str})`);
  return qs.parse(str, {
    allowPrototypes: true
  });
}
