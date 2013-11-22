var director = require('director')
  , isServer = typeof window === 'undefined'
  , Handlebars = isServer ? require('handlebars') : require('hbsfy/runtime')
  , viewsDir = (isServer ? __dirname : 'app') + '/views'
  , DirectorRouter = isServer ? director.http.Router : director.Router
  , firstRender = true
;

// Register Handlebars Helpers
require('./helpers')(Handlebars).register();

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
    /** If it's the first render on the client, just return; we don't want to
     * replace the page's HTML.
     */
    if (!isServer && firstRender) {
      firstRender = false;
      return;
    }

    // `routeContext` has `req` and `res` when on the server (from Director).
    var routeContext = this
      , params = Array.prototype.slice.call(arguments)
      , handleErr = router.handleErr.bind(routeContext)
    ;

    function handleRoute() {
      handler.apply(null, params.concat(function routeHandler(err, viewPath, data) {
        if (err) return handleErr(err);

        data = data || {};
        data.renderer = isServer ? 'server' : 'client';

        router.renderView(viewPath, data, function(err, html) {
          if (err) return handleErr(err);

          if (isServer) {
            router.handleServerRoute(viewPath, html, routeContext.req, routeContext.res);
          } else {
            router.handleClientRoute(viewPath, html);
          }
        });
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

Router.prototype.renderView = function(viewPath, data, callback) {
  try {
    var template = require(viewsDir + '/' + viewPath + '.hbs')
      , html = template(data)
    ;
    callback(null, html);
  } catch (err) {
    callback(err);
  }
};

Router.prototype.wrapWithLayout = function(locals, callback) {
  try {
    var layout = require(viewsDir + '/layout')
      , layoutHtml = layout(locals)
    ;
    callback(null, layoutHtml);
  } catch (err) {
    callback(err);
  }
};

Router.prototype.handleClientRoute = function(viewPath, html) {
  document.getElementById('view-container').innerHTML = html;
};

Router.prototype.handleServerRoute = function(viewPath, html, req, res) {
  // Any objects we want to serialize to the client on pageload.
  var bootstrappedData = {
  };

  var locals = {
    body: html,
    bootstrappedData: JSON.stringify(bootstrappedData),
  };

  this.wrapWithLayout(locals, function(err, layoutHtml) {
    res.send(layoutHtml);
  });
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
Router.prototype.start = function(bootstrappedData) {
  this.bootstrappedData = bootstrappedData;

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
    var el = e.target
      , dataset = el && el.dataset
    ;
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
