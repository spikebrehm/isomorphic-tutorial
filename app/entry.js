/**
 * Entry point for client-side.
 */

var Router = require('./router')
  , routes = require('./routes')
  , router = new Router(routes)
  , jQuery = require('jquery')
  , Backbone = require('backbone')
;

window.router = router;

window.$ = window.jQuery = jQuery;

Backbone.$ = jQuery;

router.start(window.bootstrappedData);
