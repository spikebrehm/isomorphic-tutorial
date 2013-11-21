var apiClient = require('../api_client')
  , $ = require('jquery')
;

module.exports = PostsNew;

function PostsNew(options) {
  console.log('initialize PostsNew view');

  this.router = options.router;

  this.initFormSubmit();
}

PostsNew.prototype.initFormSubmit = function() {
  var $form = $('#post-form')
    , router = this.router
  ;

  $form.on('submit', function(e) {
    e.preventDefault();

    apiClient.post($form.attr('action'))
      .send($form.serialize())
      .end(function(response) {
        if (response.ok) {
          router.setRoute('/posts');
        } else {
          alert(response.body.error);
        }
      });
  });
};
