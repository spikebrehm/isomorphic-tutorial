var React = require('react');

// Require Handlebars for layout.
require('handlebars');

module.exports = RendererServer;

function RendererServer() {}

RendererServer.viewsDir = process.cwd() + '/app/views';

RendererServer.prototype.render = function(component, req, res) {
  var html = React.renderToString(component);

  var locals = {
    body: html,
  };

  wrapWithLayout(locals, function(err, layoutHtml) {
    if (err) return res.status(500).type('text').send(err.message);
    res.send(layoutHtml);
  });
};

RendererServer.prototype.handleErr = function(err) {
  console.error(err.message + err.stack);
  this.next(err);
};

/**
 * Helper functions.
 */

function wrapWithLayout(locals, callback) {
  try {
    var layout = require(RendererServer.viewsDir + '/layout');
    var layoutHtml = layout(locals);
    callback(null, layoutHtml);
  } catch (err) {
    callback(err);
  }
}
