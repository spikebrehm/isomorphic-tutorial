var moment = require('moment');

module.exports = function(Handlebars) {

  var helpers = {
    // Example Handlebars helper
    log: function(obj) {
      console.log(obj);
    },

    formatDate: function(dateStr) {
      return moment(dateStr).format('LLLL');
    }
  };

  function register() {
    for (var key in helpers) {
      if (helpers.hasOwnProperty(key)) {
        Handlebars.registerHelper(key, helpers[key]);
      }
    }
  }

  return {
    helpers: helpers,
    register: register
  };
};
