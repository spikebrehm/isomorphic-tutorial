var express = require('express')
  , app = express()
  , posts = []
  , postId = 0
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
