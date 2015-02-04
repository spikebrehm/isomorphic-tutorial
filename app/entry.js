/**
 * Entry point for client-side.
 */

var Router = require('./router');
var routes = require('./routes');
var router = new Router(routes);

window.router = router;

router.start(window.bootstrappedData);
