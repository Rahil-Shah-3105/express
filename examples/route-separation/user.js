const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
logger.info(`ENTERING: list() method`);
};

exports.load = function(req, res, next){
  var id = req.params.id;
  req.user = users[id];
logger.info(`ENTERING: load() method`);
  if (req.user) {
    next();
	logger.warn(`ENTERING: load() method`);
  } else {
    var err = new Error('cannot find user ' + id);
    err.status = 404;
    next(err);
  }
logger.warn(`load(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed ${id}`);
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
};

exports.edit = function(req, res){
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
};

exports.update = function(req, res){
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
  req.user.email = user.email;
  res.redirect(req.get('Referrer') || '/');
};
