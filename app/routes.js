module.exports = function(match) {
  match('/', function(callback) {
    console.log('home');
    callback(null, 'index', {name: 'Spike'});
  });

  match('/posts', function(callback) {
    console.log('posts');
    callback(null, 'posts');
  });

  match('/posts/:id', function(id, callback) {
    console.log('post: ' + id);
    callback(null, 'post');
  });
};
