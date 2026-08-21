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
logger.debug(`>>> Entering resolve(dir=${dir},file=${file})`);
logger.debug(`<<< Exiting resolve(dir=${dir},file=${file})`);
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
logger.debug(`>>> Entering View(name=${name},options=${options})`);
  var opts = options || {};

  this.defaultEngine = opts.defaultEngine;
  this.ext = extname(name);
logger.debug(`View(name=${name},options=${options}): this.defaultEngine → ${this.defaultEngine}`);
  this.name = name;
  this.root = opts.root;

logger.debug(`View(name=${name},options=${options}): name → ${name}`);
  if (!this.ext && !this.defaultEngine) {
	logger.debug(`View(name=${name},options=${options}): this.name → ${this.name}`);
logger.debug(`View(name=${name},options=${options}): this.root → ${this.root}`);
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

	logger.debug(`View(name=${name},options=${options}): mod → ${mod}`);
    // default engine export
    var fn = require(mod).__express
	logger.debug(`View(name=${name},options=${options}): fn → ${fn}`);

    if (typeof fn !== 'function') {
      throw new Error('Module "' + mod + '" does not provide a view engine.')
    }

    opts.engines[this.ext] = fn
  }

  // store loaded engine
  this.engine = opts.engines[this.ext];

logger.debug(`View(name=${name},options=${options}): this.engine → ${this.engine}`);
  // lookup path
  this.path = this.lookup(fileName);
logger.debug(`<<< Exiting View(name=${name},options=${options})`);
}

/**
 * Lookup view by the given `name`
 *
 * @param {string} name
 * @private
 */

View.prototype.lookup = function lookup(name) {
logger.debug(`>>> Entering lookup(name=${name})`);
  var path;
  var roots = [].concat(this.root);
logger.debug(`lookup(name=${name}): roots → ${roots}`);

  debug('lookup "%s"', name);

  for (var i = 0; i < roots.length && !path; i++) {
    var root = roots[i];

    // resolve the path
    var loc = resolve(root, name);
	logger.debug(`lookup(name=${name}): loc → ${loc}`);
    var dir = dirname(loc);
	logger.debug(`lookup(name=${name}): dir → ${dir}`);
    var file = basename(loc);
	logger.debug(`lookup(name=${name}): file → ${file}`);

    // resolve the file
    path = this.resolve(dir, file);
  }

logger.debug(`<<< Exiting lookup(name=${name})`);
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
logger.debug(`>>> Entering render(options=${options},callback=${callback})`);
  var sync = true;

  debug('render "%s"', this.path);

  // render, normalizing sync callbacks
  this.engine(this.path, options, function onRender() {
    if (!sync) {
      return callback.apply(this, arguments);
    }

    // copy arguments
    var args = new Array(arguments.length);
	logger.debug(`onRender(options=${options},args=${args}): args → ${args}`);
    var cntx = this;

    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    // force callback to be async
    return process.nextTick(function renderTick() {
	logger.debug('>>> Entering renderTick()');
      return callback.apply(cntx, args);
    });
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
logger.debug(`resolve(dir=${dir},file=${file}): path → ${path}`);
  var stat = tryStat(path);
logger.debug(`resolve(dir=${dir},file=${file}): stat → ${stat}`);

  if (stat && stat.isFile()) {
    return path;
  }

  // <path>/index.<ext>
  path = join(dir, basename(file, ext), 'index' + ext);
  stat = tryStat(path);

  if (stat && stat.isFile()) {
	logger.debug(`<<< Exiting resolve(dir=${dir},file=${file})`);
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
logger.debug(`>>> Entering tryStat(path=${path})`);
  debug('stat "%s"', path);

  try {
    return fs.statSync(path);
  } catch (e) {
	logger.error(`Exception in tryStat(path=${path}): ${e.message}`, e);
	logger.debug(`<<< Exiting tryStat(path=${path})`);
    return undefined;
  }
}
