/**
 * Entry point for client-side.
 */

var Router = require('./router')
  , routes = require('./routes')
  , router = new Router(routes)
;

window.router = router;

router.start(window.bootstrappedData);
