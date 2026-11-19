const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
logger.info(`list(req=${req}, res=${res}): CCPA-AUDIT: Admt decision — Record access recorded for the audit trail`, { "event.action": "list" });
};

exports.load = function(req, res, next){
  var id = req.params.id;
  req.user = users[id];
logger.info(`load(req=${req}, res=${res}, next=${next}): CCPA-AUDIT: Cyber audit — Record access recorded for the audit trail ${id}`, { "event.action": "load" });
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
    err.status = 404;
    next(err);
  }
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
logger.info(`view(req=${req}, res=${res}): CCPA-AUDIT: Admt decision — Record access recorded for the audit trail`, { "event.action": "view" });
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
logger.info(`update(req=${req}, res=${res}): CCPA-AUDIT: Risk assessment — State change recorded for the audit trail`, { "event.action": "update" });
};
