var Backbone = require('backbone')
  , apiClient = require('../api_client')
;

var PostsNewView = Backbone.View.extend({
  events: {
    'submit form': 'submitForm'
  },

  submitForm: function(e) {
    e.preventDefault();

    var $form = $(e.currentTarget)
      , url = $form.attr('action')
      , data = $form.serialize()
    ;

    apiClient.post(url).send(data).end(function(response) {
      if (response.ok) {
        // redirect
        var post = response.body.post
          , postUrl = '/posts/' + post.id
        ;
        router.setRoute(postUrl);
      } else {
        alert(response.error);
      }
    });
  },

  initialize: function(options) {
    console.log('backbone biatch');
  }
});

module.exports = PostsNewView;
