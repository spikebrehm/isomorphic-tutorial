var React = require('react');

var Post = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <small>Posted by {this.props.author} at {this.props.created_at}</small>
        <p>{this.props.body}</p>
      </div>
    );
  }
});

module.exports = Post;
