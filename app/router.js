var director = require('director')
  , isServer = typeof window === 'undefined'
  , Handlebars = require('handlebars')
  , React = require('react-tools').React
  , viewsDir = (isServer ? __dirname : 'app') + '/views'
  , DirectorRouter
  , firstRender = true
;

if (isServer) {
  DirectorRouter = director.http.Router;
} else {
  DirectorRouter = director.Router;
}

module.exports = Router;

function Router(routesFn) {
  if (routesFn == null) throw new Error("Must provide routes.");

  this.directorRouter = new DirectorRouter(this.parseRoutes(routesFn));

  // Express middleware.
  if (isServer) {
    this.middleware = function(req, res, next) {
      // Attach `this.next` to route handler, for better handling of errors.
      this.directorRouter.attach(function() {
        this.next = next;
      });

      this.directorRouter.dispatch(req, res, function (err) {
        if (err) {
          next(err);
        }
      });
    }.bind(this);
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

        router.renderView(viewPath, data, function(err, component) {
          if (err) return handleErr(err);

          if (isServer) {
            router.handleServerRoute(component, routeContext.req, routeContext.res);
          } else {
            router.handleClientRoute(component);
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
    var Component = require(viewsDir + '/' + viewPath)
    ;
    callback(null, Component(data));
  } catch (err) {
    callback(err);
  }
};

Router.prototype.wrapWithLayout = function(html, callback) {
  try {
    var layout = require(viewsDir + '/layout')
      , layoutHtml = layout({body: html})
    ;
    callback(null, layoutHtml);
  } catch (err) {
    callback(err);
  }
};

Router.prototype.handleClientRoute = function(component) {
  React.renderComponent(component, document.getElementById('view-container'));
};

Router.prototype.handleServerRoute = function(component, req, res) {
  React.renderComponentToString(component, function(html){
    this.wrapWithLayout(html, function(err, layoutHtml) {
      res.send(layoutHtml);
    });
  }.bind(this));
};

Router.prototype.initPushState = function() {
  this.directorRouter.configure({
    html5history: true
  });
};

/**
 * Client-side handler to start router.
 */
Router.prototype.start = function() {
  this.initPushState();

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

  this.directorRouter.init();
};
