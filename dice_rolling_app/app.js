const HTTP = require('http');
const URL = require('url').URL; // URL class
const PORT = 3000;

const dieRoll = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
}

const getParams = (path) => {
  const url = new URL(path, `http://localhost:${PORT}`);
  return  url.searchParams; // { rolls: x => sides: y }
}

const rollDice = (params) => {
  const [ rolls, sides ] = [params.get('rolls'), params.get('sides')];
  let result = '';

  for (let count = 0; count < rolls; count++) {
    result += dieRoll(sides) + '\n';
  }

  return result;
}

const SERVER = HTTP.createServer((req, res) => {
  const method = req.method;
  const path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    const params = getParams(path);
    const nums = rollDice(params);

    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });

    res.write(`${nums}\n`);
    res.write(`${method} ${path}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});