var express = require('express')
  , _ = require('underscore')
  , app = express()
  , postId = 0
  , posts = [{
      id: ++postId,
      title: "How to build an isomorphic app.",
      author: "spike",
      body: "It's really not that hard!",
    }, {
      id: ++postId,
      title: "Why JavaScript is eating the world.",
      author: "spike",
      body: "It's the lingua franca of the web.",
    }]
;

module.exports = app;

app.use(express.bodyParser());

app.get('/posts.json', function(req, res) {
  res.send(posts);
});

app.post('/posts.json', function(req, res) {
  var post = req.body;
  post.id = ++postId;
  posts.push(post);
  res.send({success: true});
});

app.get('/posts/:id.json', function(req, res) {
  var id = parseInt(req.params.id, 10)
    , post = _.find(posts, function(p) { return p.id === id })
  ;
  if (post) {
    res.send(post);
  } else {
    res.send(404, {error: 'Not found.'});
  }
});
