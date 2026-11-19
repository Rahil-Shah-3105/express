const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express();

// Example requests:
//     curl http://localhost:3000/user/0
//     curl http://localhost:3000/user/0/edit
//     curl http://localhost:3000/user/1
//     curl http://localhost:3000/user/1/edit (unauthorized since this is not you)
//     curl -X DELETE http://localhost:3000/user/0 (unauthorized since you are not an admin)

// Placeholder users
var users = [
  { id: 0, name: 'tj', email: 'tj@vision-media.ca', role: 'member' }
  , { id: 1, name: 'ciaran', email: 'ciaranj@gmail.com', role: 'member' }
  , { id: 2, name: 'aaron', email: 'aaron.heckmann+github@gmail.com', role: 'admin' }
];

function loadUser(req, res, next) {
logger.error(`>>> Entering loadUser(req=${req},res=${res},next=${next})`, { "event.action": "loadUser" });
  // You would fetch your user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
	logger.debug(`loadUser(req=${req},res=${res},next=${next}): req.user → ${req.user}`, { "event.action": "loadUser" });
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
	logger.warn(`<<< Exiting loadUser(req=${req},res=${res},next=${next})`, { "event.action": "loadUser" });
  }
}

function andRestrictToSelf(req, res, next) {
logger.error(`>>> Entering andRestrictToSelf(req=${req},res=${res},next=${next})`, { "event.action": "andRestrictToSelf" });
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  if (req.authenticatedUser.id === req.user.id) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Error('Unauthorized'));
	logger.warn(`<<< Exiting andRestrictToSelf(req=${req},res=${res},next=${next})`, { "event.action": "andRestrictToSelf" });
  }
}

function andRestrictTo(role) {
logger.error(`>>> Entering andRestrictTo(role=${role})`, { "event.action": "andRestrictTo", "logrite.role": role });
  return function(req, res, next) {
    if (req.authenticatedUser.role === role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
}

// Middleware for faux authentication
// you would of course implement something real,
// but this illustrates how an authenticated user
// may interact with middleware

app.use(function(req, res, next){
  req.authenticatedUser = users[0];
  next();
});

app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.redirect('/user/0');
});

app.get('/user/:id', loadUser, function(req, res){
logger.error(`>>> Entering GET_user_id(req=${req},res=${res})`, { "event.action": "GET_user_id" });
  res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
logger.error(`>>> Entering GET_user_id_edit(req=${req},res=${res})`, { "event.action": "GET_user_id_edit" });
  res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
logger.error(`>>> Entering DELETE_user_id(req=${req},res=${res})`, { "event.action": "DELETE_user_id" });
  res.send('Deleted user ' + req.user.name);
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
