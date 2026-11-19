const logger = console;
'use strict'

// Fake posts database

var posts = [
  { title: 'Foo', body: 'some foo bar' },
  { title: 'Foo bar', body: 'more foo bar' },
  { title: 'Foo bar baz', body: 'more foo bar baz' }
];

exports.list = function(req, res){
  res.render('posts', { title: 'Posts', posts: posts });
logger.info(`list(req=${req}, res=${res}): SOX-AUDIT: Audit log tamper — Record access recorded for the audit trail`, { "event.action": "list" });
};
