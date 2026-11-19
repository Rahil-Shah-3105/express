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
logger.error(`>>> Entering normalizeType(type=${type})`, { "event.action": "normalizeType", "logrite.type": type });
logger.warn(`<<< Exiting normalizeType(type=${type})`, { "event.action": "normalizeType", "logrite.type": type });
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
logger.error(`>>> Entering normalizeTypes(types=${types})`, { "event.action": "normalizeTypes", "logrite.types": types });
logger.warn(`<<< Exiting normalizeTypes(types=${types})`, { "event.action": "normalizeTypes", "logrite.types": types });
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
logger.error(`>>> Entering acceptParams(str=${str})`, { "event.action": "acceptParams", "logrite.str": str });
  var length = str.length;
  var colonIndex = str.indexOf(';');
  var index = colonIndex === -1 ? length : colonIndex;
  var ret = { value: str.slice(0, index).trim(), quality: 1, params: {} };
logger.error(`acceptParams(str=${str}): ret → ${ret}`, { "event.action": "acceptParams", "logrite.str": str });

  while (index < length) {
    var splitIndex = str.indexOf('=', index);
	logger.error(`acceptParams(str=${str}): splitIndex → ${splitIndex}`, { "event.action": "acceptParams", "logrite.str": str });
    if (splitIndex === -1) break;

    var colonIndex = str.indexOf(';', index);
	logger.error(`acceptParams(str=${str}): colonIndex → ${colonIndex}`, { "event.action": "acceptParams", "logrite.str": str });
    var endIndex = colonIndex === -1 ? length : colonIndex;

    if (splitIndex > endIndex) {
      index = str.lastIndexOf(';', splitIndex - 1) + 1;
      continue;
    }

    var key = str.slice(index, splitIndex).trim();
	logger.error(`acceptParams(str=${str}): key → ${key}`, { "event.action": "acceptParams", "logrite.str": str });
    var value = str.slice(splitIndex + 1, endIndex).trim();
	logger.error(`acceptParams(str=${str}): value → ${value}`, { "event.action": "acceptParams", "logrite.str": str });

    if (key === 'q') {
      ret.quality = parseFloat(value);
    } else {
      ret.params[key] = value;
    }

    index = endIndex + 1;
  }

logger.warn(`<<< Exiting acceptParams(str=${str})`, { "event.action": "acceptParams", "logrite.str": str });
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
logger.error(`>>> Entering compileETag(val=${val})`, { "event.action": "compileETag", "logrite.val": val });
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
logger.warn(`<<< Exiting compileETag(val=${val})`, { "event.action": "compileETag", "logrite.val": val });
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
logger.error(`>>> Entering compileQueryParser(val=${val})`, { "event.action": "compileQueryParser", "logrite.val": val });
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
logger.warn(`<<< Exiting compileQueryParser(val=${val})`, { "event.action": "compileQueryParser", "logrite.val": val });
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
logger.error(`>>> Entering compileTrust(val=${val})`, { "event.action": "compileTrust", "logrite.val": val });
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
logger.error(`>>> Entering setCharset(type=${type},charset=${charset})`, { "event.action": "setCharset", "logrite.type": type, "logrite.charset": charset });
  if (!type || !charset) {
    return type;
  }

  // parse type
  var parsed = contentType.parse(type);
logger.error(`setCharset(type=${type},charset=${charset}): parsed → ${parsed}`, { "event.action": "setCharset", "logrite.type": type, "logrite.charset": charset });

  // set charset
  parsed.parameters.charset = charset;

  // format type
logger.warn(`<<< Exiting setCharset(type=${type},charset=${charset})`, { "event.action": "setCharset", "logrite.type": type, "logrite.charset": charset });
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
logger.error(`>>> Entering createETagGenerator(options=${options})`, { "event.action": "createETagGenerator", "logrite.options": options });
  return function generateETag (body, encoding) {
logger.error(`>>> Entering generateETag(body=${body},encoding=${encoding})`, { "event.action": "generateETag", "logrite.encoding": encoding });
    var buf = !Buffer.isBuffer(body)
      ? Buffer.from(body, encoding)
      : body
	logger.warn(`<<< Exiting generateETag(body=${body},encoding=${encoding})`, { "event.action": "generateETag", "logrite.encoding": encoding });

logger.warn(`<<< Exiting createETagGenerator(options=${options})`, { "event.action": "createETagGenerator", "logrite.options": options });
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
logger.error(`>>> Entering parseExtendedQueryString(str=${str})`, { "event.action": "parseExtendedQueryString", "logrite.str": str });
logger.warn(`<<< Exiting parseExtendedQueryString(str=${str})`, { "event.action": "parseExtendedQueryString", "logrite.str": str });
  return qs.parse(str, {
    allowPrototypes: true
  });
}
