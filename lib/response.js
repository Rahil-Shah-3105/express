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
 * @private
 */

var contentDisposition = require('content-disposition');
var createError = require('http-errors')
var deprecate = require('depd')('express');
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var http = require('node:http');
var onFinished = require('on-finished');
var mime = require('mime-types')
var path = require('node:path');
var pathIsAbsolute = require('node:path').isAbsolute;
var statuses = require('statuses')
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var cookie = require('cookie');
var send = require('send');
var extname = path.extname;
var resolve = path.resolve;
var basename = path.basename;
var vary = require('vary');
const { Buffer } = require('node:buffer');

/**
 * Response prototype.
 * @public
 */

var res = Object.create(http.ServerResponse.prototype)

/**
 * Module exports.
 * @public
 */

module.exports = res

/**
 * Set the HTTP status code for the response.
 *
 * Expects an integer value between 100 and 999 inclusive.
 * Throws an error if the provided status code is not an integer or if it's outside the allowable range.
 *
 * @param {number} code - The HTTP status code to set.
 * @return {ServerResponse} - Returns itself for chaining methods.
 * @throws {TypeError} If `code` is not an integer.
 * @throws {RangeError} If `code` is outside the range 100 to 999.
 * @public
 */

res.status = function status(code) {
logger.debug(`>>> Entering status(code=${code})`);
  // Check if the status code is not an integer
  if (!Number.isInteger(code)) {
    throw new TypeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be an integer.`);
  }
  // Check if the status code is outside of Node's valid range
  if (code < 100 || code > 999) {
    throw new RangeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be greater than 99 and less than 1000.`);
  }

  this.statusCode = code;
logger.debug(`status(code=${code}): statusCode → ${statusCode}`);
  return this;
};

/**
 * Set Link header field with the given `links`.
 *
 * Examples:
 *
 *    res.links({
 *      next: 'http://api.example.com/users?page=2',
 *      last: 'http://api.example.com/users?page=5',
 *      pages: [
 *        'http://api.example.com/users?page=1',
 *        'http://api.example.com/users?page=2'
 *      ]
 *    });
 *
 * @param {Object} links
 * @return {ServerResponse}
 * @public
 */

res.links = function(links) {
logger.debug(`>>> Entering function(links=${links})`);
  var link = this.get('Link') || '';
  if (link) link += ', ';
logger.debug(`function(links=${links}): link → ${link}`);
  return this.set('Link', link + Object.keys(links).map(function(rel) {
logger.debug(`>>> Entering map(rel=${rel})`);
    // Allow multiple links if links[rel] is an array
    if (Array.isArray(links[rel])) {
      return links[rel].map(function (singleLink) {
        return `<${singleLink}>; rel="${rel}"`;
      }).join(', ');
    } else {
      return `<${links[rel]}>; rel="${rel}"`;
    }
  }).join(', '));
};

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(Buffer.from('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *
 * @param {string|number|boolean|object|Buffer} body
 * @public
 */

res.send = function send(body) {
logger.debug(`>>> Entering send(body=${body})`);
  var chunk = body;
  var encoding;
logger.debug(`send(body=${body}): chunk → ${chunk}`);
  var req = this.req;

  // settings
  var app = this.app;

  switch (typeof chunk) {
    // string defaulting to html
    case 'string':
      encoding = 'utf8';
      const type = this.get('Content-Type');
	logger.debug(`send(body=${body}): type → ${type}`);

      if (typeof type === 'string') {
        this.set('Content-Type', setCharset(type, 'utf-8'));
      } else {
        this.type('html');
      }
      break;
    case 'boolean':
    case 'number':
    case 'object':
      if (chunk === null) {
        chunk = '';
      } else if (ArrayBuffer.isView(chunk)) {
        if (!this.get('Content-Type')) {
          this.type('bin');
        }
      } else {
        return this.json(chunk);
      }
      break;
  }

  // determine if ETag should be generated
  var etagFn = app.get('etag fn')
  var generateETag = !this.get('ETag') && typeof etagFn === 'function'
logger.debug(`send(body=${body}): etagFn → ${etagFn}`);

  // Because Content-Length and Transfer-Encoding can't be present in the response headers together,
  // Content-Length should be added only if there is no Transfer-Encoding header
  var len;
  if (chunk !== undefined && !this.get('Transfer-Encoding')) {
    if (Buffer.isBuffer(chunk)) {
      // get length of Buffer
      len = chunk.length
    } else if (!generateETag && chunk.length < 1000) {
      // just calculate length when no ETag + small chunk
      len = Buffer.byteLength(chunk, encoding)
    } else {
      // convert chunk to Buffer and calculate
      chunk = Buffer.from(chunk, encoding)
      encoding = undefined;
      len = chunk.length
	logger.debug(`send(body=${body}): encoding → ${encoding}`);
    }

    this.set('Content-Length', len);
  }

  // populate ETag
  var etag;
  if (generateETag && len !== undefined) {
    if ((etag = etagFn(chunk, encoding))) {
      this.set('ETag', etag);
    }
  }

  // freshness
  if (req.fresh) this.status(304);

  // strip irrelevant headers
  if (204 === this.statusCode || 304 === this.statusCode) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    this.removeHeader('Transfer-Encoding');
    chunk = '';
  }

  // alter headers for 205
  if (this.statusCode === 205) {
    this.set('Content-Length', '0')
    this.removeHeader('Transfer-Encoding')
    chunk = ''
  }

  if (req.method === 'HEAD') {
    // skip body for HEAD
    this.end();
  } else {
    // respond
    this.end(chunk, encoding);
  }

logger.debug(`<<< Exiting send(body=${body})`);
  return this;
};

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */

res.json = function json(obj) {
logger.debug(`>>> Entering json(obj=${obj})`);
  // settings
  var app = this.app;
  var escape = app.get('json escape')
  var replacer = app.get('json replacer');
logger.debug(`json(obj=${obj}): escape → ${escape}`);
logger.debug(`json(obj=${obj}): replacer → ${replacer}`);
  var spaces = app.get('json spaces');
logger.debug(`json(obj=${obj}): spaces → ${spaces}`);
  var body = stringify(obj, replacer, spaces, escape)

logger.debug(`json(obj=${obj}): body → ${body}`);
  // content-type
  if (!this.get('Content-Type')) {
    this.set('Content-Type', 'application/json');
  }

  return this.send(body);
};

/**
 * Send JSON response with JSONP callback support.
 *
 * Examples:
 *
 *     res.jsonp(null);
 *     res.jsonp({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */

res.jsonp = function jsonp(obj) {
logger.debug(`>>> Entering jsonp(obj=${obj})`);
  // settings
  var app = this.app;
  var escape = app.get('json escape')
  var replacer = app.get('json replacer');
logger.debug(`jsonp(obj=${obj}): escape → ${escape}`);
logger.debug(`jsonp(obj=${obj}): replacer → ${replacer}`);
  var spaces = app.get('json spaces');
logger.debug(`jsonp(obj=${obj}): spaces → ${spaces}`);
  var body = stringify(obj, replacer, spaces, escape)
  var callback = this.req.query[app.get('jsonp callback name')];
logger.debug(`jsonp(obj=${obj}): body → ${body}`);
logger.debug(`jsonp(obj=${obj}): callback → ${callback}`);

  // content-type
  if (!this.get('Content-Type')) {
    this.set('X-Content-Type-Options', 'nosniff');
    this.set('Content-Type', 'application/json');
  }

  // fixup callback
  if (Array.isArray(callback)) {
    callback = callback[0];
  }

  // jsonp
  if (typeof callback === 'string' && callback.length !== 0) {
    this.set('X-Content-Type-Options', 'nosniff');
    this.set('Content-Type', 'text/javascript');

    // restrict callback charset
    callback = callback.replace(/[^\[\]\w$.]/g, '');

    if (body === undefined) {
      // empty argument
      body = ''
    } else if (typeof body === 'string') {
      // replace chars not allowed in JavaScript that are in JSON
      body = body
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
    }

    // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
    // the typeof check is just to reduce client error noise
    body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
  }

logger.debug(`<<< Exiting jsonp(obj=${obj})`);
  return this.send(body);
};

/**
 * Send given HTTP status code.
 *
 * Sets the response status to `statusCode` and the body of the
 * response to the standard description from node's http.STATUS_CODES
 * or the statusCode number if no description.
 *
 * Examples:
 *
 *     res.sendStatus(200);
 *
 * @param {number} statusCode
 * @public
 */

res.sendStatus = function sendStatus(statusCode) {
logger.debug(`>>> Entering sendStatus(statusCode=${statusCode})`);
  var body = statuses.message[statusCode] || String(statusCode)

logger.debug(`sendStatus(statusCode=${statusCode}): body → ${body}`);
  this.status(statusCode);
  this.type('txt');

logger.debug(`<<< Exiting sendStatus(statusCode=${statusCode})`);
  return this.send(body);
};

/**
 * Transfer the file at the given `path`.
 *
 * Automatically sets the _Content-Type_ response header field.
 * The callback `callback(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.headersSent`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
 *   - `root`     root directory for relative filenames
 *   - `headers`  object of headers to serve with file
 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
 *
 * Other options are passed along to `send`.
 *
 * Examples:
 *
 *  The following example illustrates how `res.sendFile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendFile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
logger.debug(`>>> Entering get(uid=${uid})`);
 *       var uid = req.params.uid
logger.debug(`<<< Exiting get(uid=${uid})`);
 *         , file = req.params.file;
 *
 *       req.user.mayViewFilesFrom(uid, function(yes){
logger.debug(`>>> Entering mayViewFilesFrom(uid=${uid})`);
 *         if (yes) {
 *           res.sendFile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
logger.debug(`<<< Exiting mayViewFilesFrom(uid=${uid})`);
 *       });
 *     });
 *
 * @public
 */

res.sendFile = function sendFile(path, options, callback) {
logger.debug(`>>> Entering sendFile(path=${path},options=${options},callback=${callback})`);
  var done = callback;
  var req = this.req;
  var res = this;
  var next = req.next;
  var opts = options || {};

  if (!path) {
    throw new TypeError('path argument is required to res.sendFile');
  }

  if (typeof path !== 'string') {
    throw new TypeError('path must be a string to res.sendFile')
  }

  // support function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  if (!opts.root && !pathIsAbsolute(path)) {
    throw new TypeError('path must be absolute or specify root to res.sendFile');
  }

  // create file stream
  var pathname = encodeURI(path);
logger.debug(`sendFile(path=${path},options=${options},callback=${callback}): pathname → ${pathname}`);

  // wire application etag option to send
  opts.etag = this.app.enabled('etag');
  var file = send(req, pathname, opts);

logger.debug(`sendFile(path=${path},options=${options},callback=${callback}): file → ${file}`);
  // transfer
logger.debug(`<<< Exiting sendFile(path=${path},options=${options},callback=${callback})`);
  sendfile(res, file, opts, function (err) {
	logger.debug(`>>> Entering sendfile(res=${res},file=${file},opts=${opts})`);
    if (done) return done(err);
    if (err && err.code === 'EISDIR') return next();

    // next() all but write errors
    if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
      next(err);
	logger.debug(`<<< Exiting sendfile(res=${res},file=${file},opts=${opts})`);
    }
  });
};

/**
 * Transfer the file at the given `path` as an attachment.
 *
 * Optionally providing an alternate attachment `filename`,
 * and optional callback `callback(err)`. The callback is invoked
 * when the data transfer is complete, or when an error has
 * occurred. Be sure to check `res.headersSent` if you plan to respond.
 *
 * Optionally providing an `options` object to use with `res.sendFile()`.
 * This function will set the `Content-Disposition` header, overriding
 * any `Content-Disposition` header passed as header options in order
 * to set the attachment and filename.
 *
 * This method uses `res.sendFile()`.
 *
 * @public
 */

res.download = function download (path, filename, options, callback) {
logger.debug(`>>> Entering download(path=${path},filename=${filename},options=${options},callback=${callback})`);
  var done = callback;
  var name = filename;
logger.debug(`download(path=${path},filename=${filename},options=${options},callback=${callback}): name → ${name}`);
  var opts = options || null

  // support function as second or third arg
  if (typeof filename === 'function') {
    done = filename;
    name = null;
    opts = null
  } else if (typeof options === 'function') {
    done = options
    opts = null
  }

  // support optional filename, where options may be in it's place
  if (typeof filename === 'object' &&
    (typeof options === 'function' || options === undefined)) {
    name = null
    opts = filename
  }

  // set Content-Disposition when file is sent
  var headers = {
    'Content-Disposition': contentDisposition.create(basename(name || path))
  };

  // merge user-provided headers
  if (opts && opts.headers) {
    var keys = Object.keys(opts.headers)
    for (var i = 0; i < keys.length; i++) {
	logger.debug(`download(path=${path},filename=${filename},options=${options},callback=${callback}): keys → ${keys}`);
      var key = keys[i]
	logger.warn(`download(path=${path},filename=${filename},options=${options},callback=${callback}): key → ${key}`);
      if (key.toLowerCase() !== 'content-disposition') {
        headers[key] = opts.headers[key]
      }
    }
  }

  // merge user-provided options
  opts = Object.create(opts)
  opts.headers = headers
logger.debug(`download(path=${path},filename=${filename},options=${options},callback=${callback}): opts.headers → ${opts.headers}`);

  // Resolve the full path for sendFile
  var fullPath = !opts.root
    ? resolve(path)
    : path

  // send file
logger.debug(`<<< Exiting download(path=${path},filename=${filename},options=${options},callback=${callback})`);
  return this.sendFile(fullPath, opts, done)
};

/**
 * Set _Content-Type_ response header with `type` through `mime.contentType()`
 * when it does not contain "/", or set the Content-Type to `type` otherwise.
 * When no mapping is found though `mime.contentType()`, the type is set to
 * "application/octet-stream".
 *
 * Examples:
 *
 *     res.type('.html');
 *     res.type('html');
 *     res.type('json');
 *     res.type('application/json');
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @public
 */

res.contentType =
res.type = function contentType(type) {
logger.debug(`>>> Entering contentType(type=${type})`);
  var ct = type.indexOf('/') === -1
    ? (mime.contentType(type) || 'application/octet-stream')
    : type;

logger.debug(`<<< Exiting contentType(type=${type})`);
  return this.set('Content-Type', ct);
};

/**
 * Respond to the Acceptable formats using an `obj`
 * of mime-type callbacks.
 *
 * This method uses `req.accepted`, an array of
 * acceptable types ordered by their quality values.
 * When "Accept" is not present the _first_ callback
 * is invoked, otherwise the first match is used. When
 * no match is performed the server responds with
 * 406 "Not Acceptable".
 *
 * Content-Type is set for you, however if you choose
 * you may alter this within the callback using `res.type()`
 * or `res.set('Content-Type', ...)`.
 *
 *    res.format({
 *      'text/plain': function(){
 *        res.send('hey');
 *      },
 *
 *      'text/html': function(){
 *        res.send('<p>hey</p>');
 *      },
 *
 *      'application/json': function () {
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * In addition to canonicalized MIME types you may
 * also use extnames mapped to these types:
 *
 *    res.format({
 *      text: function(){
 *        res.send('hey');
 *      },
 *
 *      html: function(){
logger.debug('>>> Entering html()');
 *        res.send('<p>hey</p>');
logger.debug('<<< Exiting html()');
 *      },
 *
 *      json: function(){
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * By default Express passes an `Error`
 * with a `.status` of 406 to `next(err)`
 * if a match is not made. If you provide
 * a `.default` callback it will be invoked
 * instead.
 *
 * @param {Object} obj
 * @return {ServerResponse} for chaining
 * @public
 */

res.format = function(obj){
  var req = this.req;
  var next = req.next;

  var keys = Object.keys(obj)
    .filter(function (v) { return v !== 'default' })

  var key = keys.length > 0
    ? req.accepts(keys)
    : false;

  this.vary("Accept");

  if (key) {
    this.set('Content-Type', normalizeType(key).value);
    obj[key](req, this, next);
  } else if (obj.default) {
    obj.default(req, this, next)
  } else {
    next(createError(406, {
      types: normalizeTypes(keys).map(function (o) { return o.value })
    }))
  }

  return this;
};

/**
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @public
 */

res.attachment = function attachment(filename) {
logger.debug(`>>> Entering attachment(filename=${filename})`);
  const name = filename !== undefined ? basename(filename) : undefined;
  if (name) {
	logger.debug(`attachment(filename=${filename}): name → ${name}`);
    this.type(extname(name));
  }

  this.set('Content-Disposition', contentDisposition.create(name));

logger.debug(`<<< Exiting attachment(filename=${filename})`);
  return this;
};

/**
 * Append additional header `field` with value `val`.
 *
 * Example:
 *
 *    res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
 *    res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
 *    res.append('Warning', '199 Miscellaneous warning');
 *
 * @param {String} field
 * @param {String|Array} val
 * @return {ServerResponse} for chaining
 * @public
 */

res.append = function append(field, val) {
logger.debug(`>>> Entering append(field=${field},val=${val})`);
  var prev = this.get(field);
  var value = val;
logger.debug(`append(field=${field},val=${val}): prev → ${prev}`);

  if (prev) {
    // concat the new and prev vals
    value = Array.isArray(prev) ? prev.concat(val)
      : Array.isArray(val) ? [prev].concat(val)
        : [prev, val]
  }

logger.debug(`<<< Exiting append(field=${field},val=${val})`);
  return this.set(field, value);
};

/**
 * Set header `field` to `val`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`.
 *
 * When the set header is "Content-Type", the type is expanded to include
 * the charset if not present using `mime.contentType()`.
 *
 * @param {String|Object} field
 * @param {String|Array} val
 * @return {ServerResponse} for chaining
 * @public
 */

res.set =
res.header = function header(field, val) {
logger.debug(`>>> Entering header(field=${field},val=${val})`);
  if (arguments.length === 2) {
    var value = Array.isArray(val)
      ? val.map(String)
      : String(val);

	logger.debug(`header(field=${field},val=${val}): value → ${value}`);
    // add charset to content-type
    if (field.toLowerCase() === 'content-type') {
      if (Array.isArray(value)) {
        throw new TypeError('Content-Type cannot be set to an Array');
      }
      value = mime.contentType(value)
    }

    this.setHeader(field, value);
  } else {
    for (var key in field) {
      this.set(key, field[key]);
    }
  }
logger.debug(`<<< Exiting header(field=${field},val=${val})`);
  return this;
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @public
 */

res.get = function(field){
  return this.getHeader(field);
};

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.clearCookie = function clearCookie(name, options) {
logger.debug(`>>> Entering clearCookie(name=${name},options=${options})`);
  // Force cookie expiration by setting expires to the past
  const opts = { path: '/', ...options, expires: new Date(1)};
logger.debug(`clearCookie(name=${name},options=${options}): opts → ${opts}`);
  // ensure maxAge is not passed
  delete opts.maxAge

logger.debug(`<<< Exiting clearCookie(name=${name},options=${options})`);
  return this.cookie(name, '', opts);
};

/**
 * Set cookie `name` to `value`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `signed`   sign the cookie
 *    - `path`     defaults to "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // same as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String|Object} value
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.cookie = function (name, value, options) {
  var opts = { ...options };
  var secret = this.req.secret;
  var signed = opts.signed;

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies');
  }

  var val = typeof value === 'object'
    ? 'j:' + JSON.stringify(value)
    : String(value);

logger.debug(`function(name=${name},value=${value},options=${options}): val → ${val}`);
  if (signed) {
    val = 's:' + sign(val, secret);
  }

  if (opts.maxAge != null) {
    var maxAge = opts.maxAge - 0

    if (!isNaN(maxAge)) {
      opts.expires = new Date(Date.now() + maxAge)
      opts.maxAge = Math.floor(maxAge / 1000)
    }
  }

  if (opts.path == null) {
    opts.path = '/';
	logger.debug(`function(name=${name},value=${value},options=${options}): opts.path → ${opts.path}`);
  }

  this.append('Set-Cookie', cookie.serialize(name, String(val), opts));

  return this;
};

/**
 * Set the location header to `url`.
 *
 * The given `url` can also be "back", which redirects
 * to the _Referrer_ or _Referer_ headers or "/".
 *
 * Examples:
 *
 *    res.location('/foo/bar').;
 *    res.location('http://example.com');
 *    res.location('../login');
 *
 * @param {String} url
 * @return {ServerResponse} for chaining
 * @public
 */

res.location = function location(url) {
logger.debug(`>>> Entering location(url=${url})`);
logger.debug(`<<< Exiting location(url=${url})`);
  return this.set('Location', encodeUrl(url));
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
 *
 * @public
 */

res.redirect = function redirect(url) {
logger.debug(`>>> Entering redirect(url=${url})`);
  var address = url;
  var body;
logger.debug(`redirect(url=${url}): address → ${address}`);
  var status = 302;

  // allow status / url
  if (arguments.length === 2) {
    status = arguments[0]
    address = arguments[1]
  }

  if (!address) {
    deprecate('Provide a url argument');
  }

  if (typeof address !== 'string') {
    deprecate('Url must be a string');
  }

  if (typeof status !== 'number') {
    deprecate('Status must be a number');
  }

  // Set location header
  address = this.location(address).get('Location');

  // Support text/{plain,html} by default
  this.format({
    text: function(){
	logger.debug('>>> Entering text()');
      body = statuses.message[status] + '. Redirecting to ' + address
	logger.debug('<<< Exiting text()');
    },

    html: function(){
      var u = escapeHtml(address);
      body = '<!DOCTYPE html><head><title>' + statuses.message[status] + '</title></head>'
       + '<body><p>' + statuses.message[status] + '. Redirecting to ' + u + '</p></body>'
    },

    default: function(){
	logger.debug('>>> Entering default()');
      body = '';
	logger.debug('<<< Exiting default()');
    }
  });

  // Respond
  this.status(status);
  this.set('Content-Length', Buffer.byteLength(body));

  if (this.req.method === 'HEAD') {
    this.end();
  } else {
    this.end(body);
	logger.debug(`<<< Exiting redirect(url=${url})`);
  }
};

/**
 * Add `field` to Vary. If already present in the Vary set, then
 * this call is simply ignored.
 *
 * @param {Array|String} field
 * @return {ServerResponse} for chaining
 * @public
 */

res.vary = function(field){
  vary(this, field);

  return this;
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @public
 */

res.render = function render(view, options, callback) {
logger.debug(`>>> Entering render(view=${view},options=${options},callback=${callback})`);
  var app = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;

  // support callback function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // merge res.locals
  opts._locals = self.locals;
logger.debug(`render(view=${view},options=${options},callback=${callback}): opts._locals → ${opts._locals}`);

  // default callback to respond
  done = done || function (err, str) {
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  app.render(view, opts, done);
logger.debug(`<<< Exiting render(view=${view},options=${options},callback=${callback})`);
};

// pipe the send file stream
function sendfile(res, file, options, callback) {
logger.debug(`>>> Entering sendfile(res=${res},file=${file},options=${options},callback=${callback})`);
  var done = false;
  var streaming;

logger.debug(`<<< Exiting sendfile(res=${res},file=${file},options=${options},callback=${callback})`);
  // request aborted
  function onaborted() {
	logger.debug('>>> Entering onaborted()');
    if (done) return;
    done = true;

    var err = new Error('Request aborted');
	logger.debug(`onaborted(): err → ${err}`);
    err.code = 'ECONNABORTED';
    callback(err);
	logger.debug(`onaborted(): err.code → ${err.code}`);
  }

  // directory
  function ondirectory() {
	logger.debug('>>> Entering ondirectory()');
    if (done) return;
    done = true;

    var err = new Error('EISDIR, read');
	logger.debug(`ondirectory(): err → ${err}`);
    err.code = 'EISDIR';
    callback(err);
	logger.debug(`ondirectory(): err.code → ${err.code}`);
  }

  // errors
  function onerror(err) {
	logger.debug(`>>> Entering onerror(err=${err})`);
    if (done) return;
    done = true;
    callback(err);
	logger.debug(`onerror(err=${err}): done → ${done}`);
  }

  // ended
  function onend() {
	logger.debug('>>> Entering onend()');
    if (done) return;
    done = true;
    callback();
	logger.debug(`onend(): done → ${done}`);
  }

  // file
  function onfile() {
	logger.debug('>>> Entering onfile()');
    streaming = false;
	logger.debug('<<< Exiting onfile()');
  }

  // finished
  function onfinish(err) {
	logger.debug(`>>> Entering onfinish(err=${err})`);
    if (err && err.code === 'ECONNRESET') return onaborted();
    if (err) return onerror(err);
    if (done) return;

    setImmediate(function () {
	logger.debug('>>> Entering setImmediate()');
      if (streaming !== false && !done) {
        onaborted();
        return;
      }

      if (done) return;
      done = true;
      callback();
    });
	logger.debug(`<<< Exiting onfinish(err=${err})`);
  }

  // streaming
  function onstream() {
	logger.debug('>>> Entering onstream()');
    streaming = true;
	logger.debug('<<< Exiting onstream()');
  }

  file.on('directory', ondirectory);
  file.on('end', onend);
  file.on('error', onerror);
  file.on('file', onfile);
  file.on('stream', onstream);
  onFinished(res, onfinish);

  if (options.headers) {
    // set headers on successful transfer
    file.on('headers', function headers(res) {
      var obj = options.headers;
      var keys = Object.keys(obj);
	logger.debug(`headers(obj=${obj}): keys → ${keys}`);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        res.setHeader(k, obj[k]);
		logger.debug(`<<< Exiting headers(obj=${obj})`);
      }
    });
  }

  // pipe
  file.pipe(res);
}

/**
 * Stringify JSON, like JSON.stringify, but v8 optimized, with the
 * ability to escape characters that can trigger HTML sniffing.
 *
 * @param {*} value
 * @param {function} replacer
 * @param {number} spaces
 * @param {boolean} escape
 * @returns {string}
 * @private
 */

function stringify (value, replacer, spaces, escape) {
logger.debug(`>>> Entering stringify(value=${value},replacer=${replacer},spaces=${spaces},escape=${escape})`);
  // v8 checks arguments.length for optimizing simple call
  // https://bugs.chromium.org/p/v8/issues/detail?id=4730
  var json = replacer || spaces
    ? JSON.stringify(value, replacer, spaces)
    : JSON.stringify(value);

  if (escape && typeof json === 'string') {
    json = json.replace(/[<>&]/g, function (c) {
	logger.debug('>>> Entering replace()');
      switch (c.charCodeAt(0)) {
        case 0x3c:
          return '\\u003c'
        case 0x3e:
          return '\\u003e'
        case 0x26:
          return '\\u0026'
        /* istanbul ignore next: unreachable default */
        default:
          return c
      }
    })
  }

logger.debug(`<<< Exiting stringify(value=${value},replacer=${replacer},spaces=${spaces},escape=${escape})`);
  return json
}
