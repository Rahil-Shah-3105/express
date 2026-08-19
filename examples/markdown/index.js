const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var escapeHtml = require('escape-html');
var express = require('../..');
var fs = require('node:fs');
var marked = require('marked');
var path = require('node:path');

var app = module.exports = express();

// register .md as an engine in express view system

app.engine('md', function(path, options, fn){
logger.debug(`>>> Entering engine(html=${html})`);
  fs.readFile(path, 'utf8', function(err, str){
	logger.debug(`>>> Entering readFile(path=${path},html=${html})`);
    if (err) return fn(err);
    var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
	logger.debug(`<<< Exiting engine(html=${html})`);
      return escapeHtml(options[name] || '');
    });
	logger.debug(`<<< Exiting readFile(path=${path},html=${html})`);
    fn(null, html);
  });
});

app.set('views', path.join(__dirname, 'views'));

// make it the default, so we don't need .md
app.set('view engine', 'md');

app.get('/', function(req, res){
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.render('index', { title: 'Markdown Example' });
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

app.get('/fail', function(req, res){
logger.debug(`>>> Entering GET_fail(req=${req},res=${res})`);
  res.render('missing', { title: 'Markdown Example' });
});
logger.debug(`<<< Exiting GET_fail(req=${req},res=${res})`);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
