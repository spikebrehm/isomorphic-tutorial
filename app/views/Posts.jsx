var React = require('react');
var Renderer = require('./Renderer.jsx');

var Posts = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Posts</h1>
        <ul>
        {this.props.posts.map(function(post, index) {
          return <li key={index}><a href={'/posts/' + post.id}>{post.title}</a></li>;
        })}
        </ul>
        <Renderer renderer={this.props.renderer} />
      </div>
    );
  }
});

module.exports = Posts;
