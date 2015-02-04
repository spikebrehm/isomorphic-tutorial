var React = require('react');
var Renderer = require('./Renderer.jsx');

var Index = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>View <a href="/posts">posts</a>.</p>
        <Renderer renderer={this.props.renderer} />
      </div>
    );
  }
});

module.exports = Index;
