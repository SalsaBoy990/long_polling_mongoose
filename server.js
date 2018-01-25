const http = require('http')
const longPolling = require('./longPolling')

// create and start the server
http.createServer(longPolling).listen(8080, 'localhost')
console.log('Server running.')
