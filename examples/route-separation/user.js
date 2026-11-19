const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
logger.info(`list(req=${req}, res=${res}): USSTATE-AUDIT: Data protection assessments — Record access recorded for the audit trail`, { "event.action": "list" });
};

exports.load = function(req, res, next){
  var id = req.params.id;
logger.info(`load(req=${req}, res=${res}, next=${next}): USSTATE-AUDIT: Opt-in consent for sensitive data — Record access recorded for the audit trail ${id}`, { "event.action": "load" });
  req.user = users[id];
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
logger.info(`view(req=${req}, res=${res}): USSTATE-AUDIT: Consumer rights (VCDPA 59.1-577 et al.) — Record access recorded for the audit trail`, { "event.action": "view" });
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
logger.info(`update(req=${req}, res=${res}): USSTATE-AUDIT: Opt-in consent for sensitive data — State change recorded for the audit trail`, { "event.action": "update" });
  res.redirect(req.get('Referrer') || '/');
};
