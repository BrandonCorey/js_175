const HTTP = require('http'); // built in node module that contains classes to implement HTTP server
const PORT = 3000;  // ephemueral port for us to use for server to listen

// 1. calling createServer returns a new instance of the http.Server class
// 2. the callback argument passed to createServer is executed everytime an HTTP request is recieved
// 3. http.Server object creates http.IncomingMessage object that is passed to first argument of callback that is passed to createServer
// 4. http.server object creates http.ServerResponse object that is passed to second argument of callback that is passed to createSever
const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200; // property that can be set for status code
    res.setHeader('Content-Type', 'text/plain'); // can use to set header
    res.write(`${method} ${path}`); // can use to write response body
    res.end(); // signals that the responoe headers and body have been set and respones is ready
    // Can also use `writeHead` to combine first statusCode and setHeader
  }
});


// Server listening for incoming TCP connections
// This module abstracts away the TCP data stream, processing it for us so that we can focus solely on the content of the HTTP requests
//  - This is different than what we had to do with netcat, where we had to physically process the raw HTTP message
SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});