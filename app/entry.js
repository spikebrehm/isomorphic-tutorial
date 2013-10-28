/**
 * Entry point for client-side.
 */

var Router = require('./router')
  , routes = require('./routes')
  , router = new Router(routes)
;

router.start();
