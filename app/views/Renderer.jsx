var React = require('react');

var Renderer = React.createClass({
  render: function() {
    return <small className="debug">
      Rendered on the <strong>{this.props.renderer}</strong>.
    </small>;
  },
});

module.exports = Renderer;
