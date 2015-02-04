var apiClient = require('./api_client');

module.exports = function(match) {
  match('/', function(callback) {
    console.log('index');

    callback(null, 'Index');
  });

  match('/posts', function(callback) {
    console.log('posts');

    apiClient.get('/posts.json', function(err, res) {
      if (err) return callback(err);

      var posts = res.body;
      callback(null, 'Posts', {posts: posts});
    });
  });

  match('/posts/new', function(callback) {
    console.log('posts new');

    callback(null, 'PostsNew');
  });

  match('/posts/:id', function(id, callback) {
    console.log('post: ' + id);

    apiClient.get('/posts/' + id + '.json', function(err, res) {
      if (err) return callback(err);

      var post = res.body;
      callback(null, 'Post', post);
    });
  });
};
