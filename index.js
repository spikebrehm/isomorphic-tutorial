var express = require('express')
  , app = express()
  , port = process.env.PORT || 3030
;

// Mount the API.

app.use('/api', require('./lib/api'));

app.listen(port);
console.log('Tutorial running on port %s', port);
