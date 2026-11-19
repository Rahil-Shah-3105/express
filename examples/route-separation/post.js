const logger = console;
'use strict'

// Fake posts database

var posts = [
  { title: 'Foo', body: 'some foo bar' },
  { title: 'Foo bar', body: 'more foo bar' },
  { title: 'Foo bar baz', body: 'more foo bar baz' }
];

exports.list = function(req, res){
logger.error(`>>> Entering list(req=${req},res=${res})`, { "event.action": "list" });
  res.render('posts', { title: 'Posts', posts: posts });
logger.warn(`<<< Exiting list(req=${req},res=${res})`, { "event.action": "list" });
};
