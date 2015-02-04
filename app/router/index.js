var director = require('director');
var React = require('react');
var isServer = !process.browser;
var DirectorRouter = isServer ? director.http.Router : director.Router;
var Renderer = require('./renderer');

module.exports = Router;

function Router(routesFn) {
  if (routesFn == null) throw new Error("Must provide routes.");

  this.directorRouter = new DirectorRouter(this.parseRoutes(routesFn));
  this.renderer = new Renderer;

  if (!isServer) {
    // Kick-off client-side initialization.
    this.start();
  }
}

/**
 * Capture routes as object that can be passed to Director.
 */
Router.prototype.parseRoutes = function(routesFn) {
  var routes = {};

  routesFn(function(pattern, handler) {
    // Server routes are an object, not a function. We just use `get`.
    if (isServer) {
      routes[pattern] = {
        get: this.getRouteHandler(handler)
      };
    } else {
      routes[pattern] = this.getRouteHandler(handler);
    }
  }.bind(this));

  return routes;
};

Router.prototype.getRouteHandler = function(handler) {
  var router = this;

  return function() {
    // `routeContext` has `req` and `res` when on the server (from Director).
    var routeContext = this;
    var params = Array.prototype.slice.call(arguments);
    var handleErr = router.renderer.handleErr.bind(routeContext);
    var handlerContext = {
      req: this.req,
      res: this.res,
    };

    function handleRoute() {
      handler.apply(handlerContext, params.concat(function routeHandler(err, viewPath, data) {
        if (err) return handleErr(err);

        data = data || {};
        // Add `router` property, i.e. so components can do redirects.
        data.router = router;
        // Add `renderer` property to demonstrate which side did the rendering.
        data.renderer = isServer ? 'server' : 'client';

        var component = router.getComponent(viewPath, data);

        router.renderer.render(component, routeContext.req, routeContext.res);
      }));
    }

    try {
      handleRoute();
    } catch (err) {
      handleErr(err);
    }
  };
};

Router.prototype.getComponent = function(viewPath, data) {
  var Component = React.createFactory(require(Renderer.viewsDir + '/' + viewPath + '.jsx'));
  return Component(data);
};

/**
 * Client-side handler to start router.
 */
Router.prototype.start = function() {
  /**
   * Tell Director to use HTML5 History API (pushState).
   */
  this.directorRouter.configure({
    html5history: true
  });

  /**
   * Intercept any links that don't have 'data-pass-thru' and route using
   * pushState.
   */
  document.addEventListener('click', function(e) {
    var el = e.target;
    var dataset = el && el.dataset;
    if (el && el.nodeName === 'A' && (
        dataset.passThru == null || dataset.passThru === 'false'
      )) {
      this.directorRouter.setRoute(el.attributes.href.value);
      e.preventDefault();
    }
  }.bind(this), false);

  /**
   * Kick off routing.
   */
  this.directorRouter.init();
};

/**
 * Client-side method for redirecting.
 */
Router.prototype.setRoute = function(route) {
  this.directorRouter.setRoute(route);
};
