/**
 * Small wrapper around `superagent` module to make it easier to consume
 * the API the same way on client & server.
 */
var superagent = require('superagent')
  , isServer = typeof window === 'undefined'
  , apiPort = process.env.API_PORT || 3031
;

module.exports = {
  get: function(path, callback) {
    if (isServer) {
      // Prepend host and port of the API server to the path.
      path = 'http://localhost:' + apiPort + path;
    } else {
      // Prepend `/api` to relative URL, to proxy to API server.
      path = '/api' + path;
    }

    superagent.get(path, callback);
  }
};
