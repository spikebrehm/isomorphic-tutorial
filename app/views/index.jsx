/**
 * @jsx React.DOM
 */
var React = require('react-tools').React;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>View <a href="/posts">posts</a>.</p>
      </div>
    );
  }
});
