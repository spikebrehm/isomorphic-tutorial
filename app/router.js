var director = require('director');
var isServer = typeof window === 'undefined';
var Handlebars = isServer ? require('handlebars') : null;
var React = require('react');
var viewsDir = (isServer ? __dirname : 'app') + '/views';
var DirectorRouter = isServer ? director.http.Router : director.Router;

// Expose `window.React` for dev tools.
if (!isServer) window.React = React;

module.exports = Router;

function Router(routesFn) {
  if (routesFn == null) throw new Error("Must provide routes.");

  this.directorRouter = new DirectorRouter(this.parseRoutes(routesFn));
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
    var handleErr = router.handleErr.bind(routeContext);
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

        if (isServer) {
          router.handleServerRoute(component, routeContext.req, routeContext.res);
        } else {
          router.handleClientRoute(component);
        }
      }));
    }

    try {
      handleRoute();
    } catch (err) {
      handleErr(err);
    }
  };
};

Router.prototype.handleErr = function(err) {
  console.error(err.message + err.stack);

  // `this.next` is defined on the server.
  if (this.next) {
    this.next(err);
  } else {
    alert(err.message);
  }
};

Router.prototype.handleClientRoute = function(component) {
  React.render(component, document.getElementById('view-container'));
};

Router.prototype.handleServerRoute = function(component, req, res) {
  var html = React.renderToString(component);

  var locals = {
    body: html,
  };

  this.wrapWithLayout(locals, function(err, layoutHtml) {
    if (err) return res.status(500).type('text').send(err.message);
    res.send(layoutHtml);
  });
};

Router.prototype.getComponent = function(viewPath, data) {
  var Component = React.createFactory(require(viewsDir + '/' + viewPath + '.jsx'));
  return Component(data);
};

Router.prototype.wrapWithLayout = function(locals, callback) {
  try {
    var layout = require(viewsDir + '/layout');
    var layoutHtml = layout(locals);
    callback(null, layoutHtml);
  } catch (err) {
    callback(err);
  }
};

/*
 * Express middleware function, for mounting routes onto an Express app.
 */
Router.prototype.middleware = function() {
  var directorRouter = this.directorRouter;

  return function middleware(req, res, next) {
    // Attach `this.next` to route handler, for better handling of errors.
    directorRouter.attach(function() {
      this.next = next;
    });

    // Dispatch the request to the Director router.
    directorRouter.dispatch(req, res, function (err) {
      // When a 404, just forward on to next Express middleware.
      if (err && err.status === 404) {
        next();
      }
    });
  };
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
