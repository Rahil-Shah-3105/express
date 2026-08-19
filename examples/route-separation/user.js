const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
logger.debug(`>>> Entering list(req=${req},res=${res})`);
  res.render('users', { title: 'Users', users: users });
logger.debug(`<<< Exiting list(req=${req},res=${res})`);
};

exports.load = function(req, res, next){
logger.debug(`>>> Entering load(req=${req},res=${res},next=${next})`);
  var id = req.params.id;
  req.user = users[id];
logger.debug(`load(req=${req},res=${res},next=${next}): id → ${id}`);
logger.debug(`load(req=${req},res=${res},next=${next}): req.user → ${req.user}`);
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
	logger.debug(`load(req=${req},res=${res},next=${next}): err → ${err}`);
    err.status = 404;
    next(err);
	logger.debug(`<<< Exiting load(req=${req},res=${res},next=${next})`);
	logger.debug(`load(req=${req},res=${res},next=${next}): err.status → ${err.status}`);
  }
};

exports.view = function(req, res){
logger.debug(`>>> Entering view(req=${req},res=${res})`);
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
logger.debug(`<<< Exiting view(req=${req},res=${res})`);
};

exports.edit = function(req, res){
logger.debug(`>>> Entering edit(req=${req},res=${res})`);
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
logger.debug(`<<< Exiting edit(req=${req},res=${res})`);
};

exports.update = function(req, res){
logger.debug(`>>> Entering update(req=${req},res=${res})`);
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
  req.user.email = user.email;
  res.redirect(req.get('Referrer') || '/');
logger.debug(`<<< Exiting update(req=${req},res=${res})`);
};
