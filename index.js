var express = require('express')
  , app = express()
  , port = process.env.PORT || 3030
  , routes = require('./app/routes')
  , Router = require('./app/router')
  , router = new Router(routes)
;

app.use(express.static(__dirname + '/public'));

// Mount the API.
app.use('/api', require('./lib/api'));

// Use the router as a middleware.
app.use(router.middleware);

app.listen(port);
console.log('Tutorial running on port %s', port);
