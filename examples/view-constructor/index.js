const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var GithubView = require('./github-view');
var md = require('marked').parse;

var app = module.exports = express();

// register .md as an engine in express view system
app.engine('md', function(str, options, fn){
  try {
    var html = md(str);
    html = html.replace(/\{([^}]+)\}/g, function(_, name){
	logger.debug(`engine(html=${html}): html → ${html}`);
      return options[name] || '';
    });
    fn(null, html);
  } catch(err) {
	logger.error(`Exception in engine(html=${html}): ${err.message}`, err);
    fn(err);
  }
});

// pointing to a particular github repo to load files from it
app.set('views', 'expressjs/express');

// register a new view constructor
app.set('view', GithubView);

app.get('/', function(req, res){
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  // rendering a view relative to the repo.
  // app.locals, res.locals, and locals passed
  // work like they normally would
  res.render('examples/markdown/views/index.md', { title: 'Example' });
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

app.get('/Readme.md', function(req, res){
logger.debug(`>>> Entering GET_Readme_md(req=${req},res=${res})`);
  // rendering a view from https://github.com/expressjs/express/blob/master/Readme.md
  res.render('Readme.md');
});
logger.debug(`<<< Exiting GET_Readme_md(req=${req},res=${res})`);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
