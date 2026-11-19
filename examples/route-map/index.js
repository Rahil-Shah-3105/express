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
        break;
    }
  }
};

var users = {
  list: function(req, res){
    res.send('user list');
	logger.info(`list(req=${req}, res=${res}): ISO42001-AUDIT: Ai governance — Record access recorded for the audit trail`, { "event.action": "list" });
  },

  get: function(req, res){
    res.send('user ' +  escapeHtml(req.params.uid))
	logger.info(`get(req=${req}, res=${res}): ISO42001-AUDIT [A.7]: Data governance — Record access recorded for the audit trail`, { "event.action": "get" });
  },

  delete: function(req, res){
    res.send('delete users');
	logger.info(`delete(req=${req}, res=${res}): ISO42001-AUDIT: Lifecycle — State change recorded for the audit trail`, { "event.action": "delete" });
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
