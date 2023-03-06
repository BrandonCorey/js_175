const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

const getParams = (path) => {
  const url = new URL(path, `http://localhost:${PORT}`);
  return url.searchParams;
};

const getPayment = (amount, APR, years) => {
  let interest = (APR / 100) / 12;
  let months = years * 12;
  return amount * (interest / (1 - Math.pow((1 + interest), (-months))));
};

const generateCalculator = (params) => {
  const amount = params.get('amount');
  const duration = params.get('duration');
  const APR = 5;
  const monthlyPayment = getPayment(amount, APR, duration);

  return (
    `Amount: ${amount}\n` +
    `Duration: ${duration} years\n` +
    `APR: ${APR}%\n` +
    `Monthly payment: ${monthlyPayment.toFixed(2)}`
  );
};

const SERVER = HTTP.createServer((req, res) => {
  const path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    let calculator = generateCalculator(getParams(path));
    res.write(calculator);
    res.statusCode = 200;
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});