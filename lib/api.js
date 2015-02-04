var express = require('express');
var _ = require('underscore');
var httpProxy = require('http-proxy');
var app = express();
var bodyParser = require('body-parser');
var postId = 0;
var posts = [{
  id: ++postId,
  title: "How to build an isomorphic app.",
  author: "spike",
  body: "It's really not that hard!",
  created_at: "2014-11-05T13:56:15.034Z",
}, {
  id: ++postId,
  title: "Why JavaScript is eating the world.",
  author: "spike",
  body: "It's the lingua franca of the web.",
  created_at: "2014-11-04T17:23:01.329Z",
}];

module.exports = app;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/posts.json', function(req, res) {
  res.send(posts);
});

app.post('/posts.json', function(req, res) {
  var post = req.body;
  if (!post.title || !post.author || !post.body) {
    res.send(400, {success: false, error: "Missing parameters."});
  } else {
    post.id = ++postId;
    post.created_at = new Date().toJSON();
    posts.push(post);
    res.send({success: true});
  }
});

app.get('/posts/:id.json', function(req, res) {
  var id = parseInt(req.params.id, 10);
  var post = _.find(posts, function(p) { return p.id === id });
  if (post) {
    res.send(post);
  } else {
    res.send(404, {error: 'Not found.'});
  }
});


/**
 * On the client, we want to be able to just send API requests to the
 * main web server using a relative URL, so we proxy requests to the
 * API server here.
 */
var proxy = new httpProxy.RoutingProxy();

app.proxyMiddleware = function(apiPort) {
  return function(req, res, next) {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: apiPort
    });
  };
};
