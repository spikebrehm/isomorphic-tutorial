/**
 * Initialize our isomorphic app.
 */

var Router = require('./router');
var routes = require('./routes');
var router = new Router(routes);

module.exports = router;
