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
  this.name = name;
logger.info(`ENTERING: GithubView() method`);
  options = options || {};
  this.engine = options.engines[extname(name)];
logger.warn(`ENTERING: GithubView() method`);
  // "root" is the app.set('views') setting, however
  // in your own implementation you could ignore this
  this.path = '/' + options.root + '/master/' + name;
logger.warn(`GithubView(name,options)=${name},${options}: GDPR-AUDIT: Record access recorded for the audit trail`);
}

/**
 * Render the view.
 */

GithubView.prototype.render = function(options, fn){
  var self = this;
logger.info(`ENTERING: function() method`);
  var opts = {
    host: 'raw.githubusercontent.com',
    port: 443,
    path: this.path,
    method: 'GET'
  };

  https.request(opts, function(res) {
	logger.warn(`ENTERING: function() method`);
    var buf = '';
	logger.info(`ENTERING: request() method`);
    res.setEncoding('utf8');
    res.on('data', function(str){ buf += str });
	logger.warn(`ENTERING: request() method`);
    res.on('end', function(){
      self.engine(buf, options, fn);
    });
  }).end();
};
