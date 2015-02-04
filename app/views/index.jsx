var React = require('react');

var Index = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>View <a href="/posts">posts</a>.</p>
      </div>
    );
  }
});

module.exports = Index;
