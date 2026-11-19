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
logger.error(`>>> Entering GithubView(name=${name},options=${options})`, { "event.action": "GithubView", "logrite.name": name, "logrite.options": options });
  this.name = name;
  options = options || {};
logger.debug(`GithubView(name=${name},options=${options}): this.name → ${this.name}`, { "event.action": "GithubView", "logrite.name": name, "logrite.options": options });
  this.engine = options.engines[extname(name)];
  // "root" is the app.set('views') setting, however
  // in your own implementation you could ignore this
  this.path = '/' + options.root + '/master/' + name;
logger.debug(`GithubView(name=${name},options=${options}): this.path → ${this.path}`, { "event.action": "GithubView", "logrite.name": name, "logrite.options": options });
}

/**
 * Render the view.
 */

GithubView.prototype.render = function(options, fn){
  var self = this;
  var opts = {
    host: 'raw.githubusercontent.com',
    port: 443,
    path: this.path,
    method: 'GET'
  };

  https.request(opts, function(res) {
    var buf = '';
    res.setEncoding('utf8');
    res.on('data', function(str){ buf += str });
    res.on('end', function(){
      self.engine(buf, options, fn);
    });
  }).end();
};
