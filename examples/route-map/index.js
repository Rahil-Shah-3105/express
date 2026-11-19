const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var escapeHtml = require('escape-html')
var express = require('../../lib/express');

var verbose = process.env.NODE_ENV !== 'test'

var app = module.exports = express();

app.map = function(a, route){
logger.error(`>>> Entering map(a=${a},route=${route})`, { "event.action": "map", "logrite.a": a, "logrite.route": route });
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        if (verbose) console.log('%s %s', key, route);
        app[key](route, a[key]);
		logger.warn(`<<< Exiting map(a=${a},route=${route})`, { "event.action": "map", "logrite.a": a, "logrite.route": route });
        break;
    }
  }
};

var users = {
  list: function(req, res){
	logger.error(`>>> Entering list(req=${req},res=${res})`, { "event.action": "list" });
    res.send('user list');
	logger.warn(`<<< Exiting list(req=${req},res=${res})`, { "event.action": "list" });
  },

  get: function(req, res){
	logger.error(`>>> Entering get(req=${req},res=${res})`, { "event.action": "get" });
    res.send('user ' +  escapeHtml(req.params.uid))
	logger.warn(`<<< Exiting get(req=${req},res=${res})`, { "event.action": "get" });
  },

  delete: function(req, res){
	logger.error(`>>> Entering delete(req=${req},res=${res})`, { "event.action": "delete" });
    res.send('delete users');
	logger.warn(`<<< Exiting delete(req=${req},res=${res})`, { "event.action": "delete" });
  }
};

var pets = {
  list: function(req, res){
    res.send('user ' + escapeHtml(req.params.uid) + '\'s pets')
  },

  delete: function(req, res){
    res.send('delete ' + escapeHtml(req.params.uid) + '\'s pet ' + escapeHtml(req.params.pid))
  }
};

app.map({
  '/users': {
    get: users.list,
    delete: users.delete,
    '/:uid': {
      get: users.get,
      '/pets': {
        get: pets.list,
        '/:pid': {
          delete: pets.delete
        }
      }
    }
  }
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
