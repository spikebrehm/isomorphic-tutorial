var React = require('react');

// Expose `window.React` for dev tools.
window.React = React;

module.exports = RendererClient;

function RendererClient() {}

RendererClient.viewsDir = 'app/views';

RendererClient.prototype.render = function(component) {
  React.render(component, document.getElementById('view-container'));
};

RendererClient.prototype.handleErr = function(err) {
  console.error(err.message + err.stack);
  alert(err);
};
