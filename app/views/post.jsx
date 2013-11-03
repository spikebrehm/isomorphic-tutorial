/**
 * @jsx React.DOM
 */
var React = require('react-tools').React;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <small>By {this.props.author}</small>
        <p>{this.props.body}</p>
      </div>
    );
  }
});

