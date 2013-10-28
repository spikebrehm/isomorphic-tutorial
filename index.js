var express = require('express')
  , httpProxy = require('http-proxy')
  , app = express()
  , port = process.env.PORT || 3030
  , apiPort = process.env.API_PORT || 3031
  , routes = require('./app/routes')
  , Router = require('./app/router')
  , router = new Router(routes)
  , api = require('./lib/api')
;

app.use(express.static(__dirname + '/public'));

// On the client, we want to be able to just send API requests to the
// main web server using a relative URL, so we proxy requests to the
// API server here.
var proxy = new httpProxy.RoutingProxy();
app.use('/api', function(req, res, next) {
  proxy.proxyRequest(req, res, {
    host: 'localhost',
    port: apiPort
  });
});

// Use the router as a middleware.
app.use(router.middleware);

app.listen(port);

// Run the API server on a separate port, so we can make
// HTTP requests to it from within our main app.
api.listen(apiPort);

console.log('Tutorial running on port %s; API on port %s',
            port,
            apiPort);
