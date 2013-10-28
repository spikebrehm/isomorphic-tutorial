var Router = require('director').Router
  , router = new Router
;

router.get('/', function() {
  console.log('home');
});

router.get('/posts', function() {
  console.log('posts');
});

router.get('/posts/:id', function(id) {
  console.log('post: ' + id);
});

router.init();
