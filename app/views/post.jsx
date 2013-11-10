/**
 * @jsx React.DOM
 */
var React = require('react-tools').React
  , moment = require('moment')
;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <small>Posted by {this.props.author} at {formatDate(this.props.created_at)}</small>
        <p>{this.props.body}</p>
      </div>
    );
  }
});

function formatDate(dateStr) {
  return moment(dateStr).format('LLLL');
}
