/**
 * @jsx React.DOM
 */
var React = require('react-tools').React;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Posts</h1>
        <ul>
        {this.props.posts.map(function(post) {
          return <li><a href={'/posts/' + post.id}>{post.title}</a></li>;
        })}
        </ul>
      </div>
    );
  }
});


