var React = require('react');
var Renderer = require('./Renderer.jsx');
var apiClient = require('../api_client');
var $ = process.browser ? require('jquery') : null;

var PostsNew = React.createClass({
  render: function() {
    return (
      <div>
        <h1>New Post</h1>

        <form method="post" role="form" ref="form" action="/api/posts.json"
          onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input name="title" className="form-control" id="post-title" />
          </div>
          <div className="form-group">
            <label htmlFor="post-author">Author</label>
            <input name="author" className="form-control" id="post-author" />
          </div>
          <div className="form-group">
            <label htmlFor="post-body">Body</label>
            <textarea name="body" className="form-control" id="post-body"></textarea>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  },

  onSubmit: function(e) {
    e.preventDefault();

    var $form = $(this.refs.form.getDOMNode());
    var router = this.props.router;

    apiClient.post($form.attr('action'))
      .send($form.serialize())
      .end(function(response) {
        if (response.ok) {
            router.setRoute('/posts');
          } else {
            alert(response.body.error);
          }
        });
  },
});

module.exports = PostsNew;

