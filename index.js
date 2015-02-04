var express = require('express');
var app = express();
var port = process.env.PORT || 3030;
var apiPort = process.env.API_PORT || 3031;
var api = require('./lib/api');
var middleware = require('./app/router/middleware');

/**
 * This initializes our routes.
 */
var router = require('./app/initialize');

// Allow directly requiring '.jsx' files.
require('node-jsx').install({extension: '.jsx'});

app.use(express.static(__dirname + '/public'));

// Mount the routes defined in `./app/routes` on our server.
app.use(middleware(router));

// On the client, we want to be able to just send API requests to the
// main web server using a relative URL, so we proxy requests to the
// API server here.
app.use('/api', api.proxyMiddleware(apiPort));

app.listen(port);

// Run the API server on a separate port, so we can make
// HTTP requests to it from within our main app.
api.listen(apiPort);

console.log('Tutorial running on port %s; API on port %s',
            port,
            apiPort);
