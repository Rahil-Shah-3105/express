const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
logger.error(`>>> Entering list(req=${req},res=${res})`, { "event.action": "list" });
  res.render('users', { title: 'Users', users: users });
logger.warn(`<<< Exiting list(req=${req},res=${res})`, { "event.action": "list" });
};

exports.load = function(req, res, next){
logger.error(`>>> Entering load(req=${req},res=${res},next=${next})`, { "event.action": "load" });
  var id = req.params.id;
  req.user = users[id];
logger.error(`load(req=${req},res=${res},next=${next}): id → ${id}`, { "event.action": "load" });
logger.debug(`load(req=${req},res=${res},next=${next}): req.user → ${req.user}`, { "event.action": "load" });
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
	logger.error(`load(req=${req},res=${res},next=${next}): err → ${err}`, { "event.action": "load" });
    err.status = 404;
	logger.debug(`load(req=${req},res=${res},next=${next}): err.status → ${err.status}`, { "event.action": "load" });
    next(err);
	logger.warn(`<<< Exiting load(req=${req},res=${res},next=${next})`, { "event.action": "load" });
  }
};

exports.view = function(req, res){
logger.error(`>>> Entering view(req=${req},res=${res})`, { "event.action": "view" });
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
logger.warn(`<<< Exiting view(req=${req},res=${res})`, { "event.action": "view" });
};

exports.edit = function(req, res){
logger.error(`>>> Entering edit(req=${req},res=${res})`, { "event.action": "edit" });
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
logger.warn(`<<< Exiting edit(req=${req},res=${res})`, { "event.action": "edit" });
};

exports.update = function(req, res){
logger.error(`>>> Entering update(req=${req},res=${res})`, { "event.action": "update" });
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
  req.user.email = user.email;
  res.redirect(req.get('Referrer') || '/');
logger.warn(`<<< Exiting update(req=${req},res=${res})`, { "event.action": "update" });
};
