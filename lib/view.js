const logger = console;
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('express:view');
var path = require('node:path');
var fs = require('node:fs');

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

/**
 * Module exports.
 * @public
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
logger.error(`>>> Entering resolve(dir=${dir},file=${file})`, { "event.action": "resolve", "logrite.dir": dir, "logrite.file": file });
logger.warn(`<<< Exiting resolve(dir=${dir},file=${file})`, { "event.action": "resolve", "logrite.dir": dir, "logrite.file": file });
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {string} name
 * @param {object} options
 * @public
 */

function View(name, options) {
logger.error(`>>> Entering View(name=${name},options=${options})`, { "event.action": "View", "logrite.name": name, "logrite.options": options });
  var opts = options || {};

  this.defaultEngine = opts.defaultEngine;
logger.debug(`View(name=${name},options=${options}): this.defaultEngine → ${this.defaultEngine}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });
  this.ext = extname(name);
  this.name = name;
logger.debug(`View(name=${name},options=${options}): this.name → ${this.name}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });
  this.root = opts.root;
logger.debug(`View(name=${name},options=${options}): this.root → ${this.root}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });

  if (!this.ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  var fileName = name;

  if (!this.ext) {
    // get extension from default engine name
    this.ext = this.defaultEngine[0] !== '.'
      ? '.' + this.defaultEngine
      : this.defaultEngine;

    fileName += this.ext;
  }

  if (!opts.engines[this.ext]) {
    // load engine
    var mod = this.ext.slice(1)
    debug('require "%s"', mod)

	logger.error(`View(name=${name},options=${options}): mod → ${mod}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });
    // default engine export
    var fn = require(mod).__express
	logger.error(`View(name=${name},options=${options}): fn → ${fn}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });

    if (typeof fn !== 'function') {
      throw new Error('Module "' + mod + '" does not provide a view engine.')
    }

    opts.engines[this.ext] = fn
  }

  // store loaded engine
  this.engine = opts.engines[this.ext];
logger.debug(`View(name=${name},options=${options}): this.engine → ${this.engine}`, { "event.action": "View", "logrite.name": name, "logrite.options": options });

  // lookup path
  this.path = this.lookup(fileName);
logger.warn(`<<< Exiting View(name=${name},options=${options})`, { "event.action": "View", "logrite.name": name, "logrite.options": options });
}

/**
 * Lookup view by the given `name`
 *
 * @param {string} name
 * @private
 */

View.prototype.lookup = function lookup(name) {
logger.error(`>>> Entering lookup(name=${name})`, { "event.action": "lookup", "logrite.name": name });
  var path;
  var roots = [].concat(this.root);
logger.error(`lookup(name=${name}): roots → ${roots}`, { "event.action": "lookup", "logrite.name": name });

  debug('lookup "%s"', name);

  for (var i = 0; i < roots.length && !path; i++) {
    var root = roots[i];

    // resolve the path
    var loc = resolve(root, name);
	logger.error(`lookup(name=${name}): loc → ${loc}`, { "event.action": "lookup", "logrite.name": name });
    var dir = dirname(loc);
	logger.error(`lookup(name=${name}): dir → ${dir}`, { "event.action": "lookup", "logrite.name": name });
    var file = basename(loc);
	logger.error(`lookup(name=${name}): file → ${file}`, { "event.action": "lookup", "logrite.name": name });

    // resolve the file
    path = this.resolve(dir, file);
  }

logger.warn(`<<< Exiting lookup(name=${name})`, { "event.action": "lookup", "logrite.name": name });
  return path;
};

/**
 * Render with the given options.
 *
 * @param {object} options
 * @param {function} callback
 * @private
 */

View.prototype.render = function render(options, callback) {
  var sync = true;

  debug('render "%s"', this.path);

  // render, normalizing sync callbacks
  this.engine(this.path, options, function onRender() {
    if (!sync) {
      return callback.apply(this, arguments);
    }

    // copy arguments
    var args = new Array(arguments.length);
	logger.error(`onRender(options=${options},args=${args}): args → ${args}`, { "event.action": "onRender", "logrite.options": options });
    var cntx = this;

    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    // force callback to be async
    return process.nextTick(function renderTick() {
      return callback.apply(cntx, args);
    });
	logger.error('>>> Entering renderTick()', { "event.action": "renderTick" });
  });

  sync = false;
};

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @private
 */

View.prototype.resolve = function resolve(dir, file) {
  var ext = this.ext;

  // <path>.<ext>
  var path = join(dir, file);
logger.error(`resolve(dir=${dir},file=${file}): path → ${path}`, { "event.action": "resolve", "logrite.dir": dir, "logrite.file": file });
  var stat = tryStat(path);
logger.error(`resolve(dir=${dir},file=${file}): stat → ${stat}`, { "event.action": "resolve", "logrite.dir": dir, "logrite.file": file });

  if (stat && stat.isFile()) {
    return path;
  }

  // <path>/index.<ext>
  path = join(dir, basename(file, ext), 'index' + ext);
  stat = tryStat(path);

  if (stat && stat.isFile()) {
	logger.warn(`<<< Exiting resolve(dir=${dir},file=${file})`, { "event.action": "resolve", "logrite.dir": dir, "logrite.file": file });
    return path;
  }
};

/**
 * Return a stat, maybe.
 *
 * @param {string} path
 * @return {fs.Stats}
 * @private
 */

function tryStat(path) {
logger.error(`>>> Entering tryStat(path=${path})`, { "event.action": "tryStat", "logrite.path": path });
  debug('stat "%s"', path);

  try {
    return fs.statSync(path);
  } catch (e) {
	logger.error(`Exception in tryStat(path=${path}): ${e.message}`, e, { "event.action": "tryStat", "event.category": "process", "logrite.path": path });
	logger.warn(`<<< Exiting tryStat(path=${path})`, { "event.action": "tryStat", "logrite.path": path });
    return undefined;
  }
}
