const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var https = require('node:https');
var path = require('node:path');
var extname = path.extname;

/**
 * Expose `GithubView`.
 */

module.exports = GithubView;

/**
 * Custom view that fetches and renders
 * remove github templates. You could
 * render templates from a database etc.
 */

function GithubView(name, options){
logger.debug(`>>> Entering GithubView(name=${name},options=${options})`);
  this.name = name;
  options = options || {};
  this.engine = options.engines[extname(name)];
logger.debug(`GithubView(name=${name},options=${options}): name → ${name}`);
  // "root" is the app.set('views') setting, however
  // in your own implementation you could ignore this
  this.path = '/' + options.root + '/master/' + name;
logger.debug(`GithubView(name=${name},options=${options}): this.name → ${this.name}`);
}

/**
 * Render the view.
 */

GithubView.prototype.render = function(options, fn){
logger.debug(`>>> Entering function(options=${options},fn=${fn})`);
  var self = this;
  var opts = {
    host: 'raw.githubusercontent.com',
    port: 443,
    path: this.path,
    method: 'GET'
  };

logger.debug(`<<< Exiting function(options=${options},fn=${fn})`);
  https.request(opts, function(res) {
    var buf = '';
    res.setEncoding('utf8');
	logger.debug(`request(opts=${opts},buf=${buf}): buf → ${buf}`);
    res.on('data', function(str){ buf += str });
	logger.debug(`<<< Exiting request(opts=${opts},buf=${buf})`);
    res.on('end', function(){
	logger.debug('>>> Entering on()');
      self.engine(buf, options, fn);
    });
  }).end();
};
