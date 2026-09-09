const logger = console;
'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
logger.warn(`list(req,res)=${req},${res}: ISO42001-AUDIT: Record access recorded for the audit trail`);
};

exports.load = function(req, res, next){
  var id = req.params.id;
  req.user = users[id];
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
    err.status = 404;
    next(err);
  }
logger.warn(`load(req,res,next)=${req},${res},${next}: ISO42001-AUDIT: Record access recorded for the audit trail ${id}`);
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
logger.warn(`view(req,res)=${req},${res}: ISO42001-AUDIT: Record access recorded for the audit trail`);
};

exports.edit = function(req, res){
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
logger.warn(`edit(req,res)=${req},${res}: ISO42001-AUDIT: State change recorded for the audit trail`);
};

exports.update = function(req, res){
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
logger.info(`update(req,res)=${req},${res}: ISO42001-AUDIT: Change management operation performed by initiator ${user}`);
  req.user.email = user.email;
  res.redirect(req.get('Referrer') || '/');
};
