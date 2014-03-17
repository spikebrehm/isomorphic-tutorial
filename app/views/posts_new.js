var Backbone = require('backbone')
  , apiClient = require('../api_client')
;

module.exports = Backbone.View.extend({
  events: {
    'submit #new_post_form': 'submitForm'
  },

  submitForm: function(e) {
    e.preventDefault();

    var path = '/posts';
    var data = $(e.currentTarget).serialize();

    apiClient
      .post(path)
      .send(data)
      .end(function(res) {
        if (res.status === 201) {
          window.router.setRoute('/posts/' + res.body.post.id);
        } else {
          alert(res.body.error);
        }
      });
  }
});
