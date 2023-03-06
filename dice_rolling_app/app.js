const HTTP = require('http');
const PORT = 3000;

const dieRoll = () => {
  return Math.floor(Math.random() * 6) + 1;
}

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;
  let num = dieRoll();

  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  res.write(`${num}\n`);
  res.write(`${method} ${path}\n`);
  res.end();
});

SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});