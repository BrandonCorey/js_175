const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

// Application server
const getParams = (path) => {
  const url = new URL(path, `http://localhost:${PORT}`);
  return url.searchParams;
};

const getPayment = (amount, APR, years) => {
  let interest = (APR / 100) / 12;
  let months = years * 12;
  return amount * (interest / (1 - Math.pow((1 + interest), (-months))));
};

const generateContent = (params) => {
  const amount = params.get('amount');
  const duration = params.get('duration');
  const APR = 5;
  const payment = getPayment(amount, APR, duration).toFixed(2);

  let content = `<tr><th>Amount:</th><td>$${amount}</td></tr>
                 <tr><th>Duration:</th><td>${duration} years</td></tr>
                 <tr><th>APR:</th><td>${APR}%</td></tr>
                 <tr><th>Monthly payment:</th><td>$${payment}</td></tr>`;
  
  return content;
}

const generateHTML = (dynamicContent) => {
  const HTML_START = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Loan Calculator</title>
      <style type="text/css">
        body {
          background: rgba(250, 250, 250);
          font-family: sans-serif;
          color: rgb(50, 50, 50);
        }
  
        article {
          width: 100%;
          max-width: 40rem;
          margin: 0 auto;
          padding: 1rem 2rem;
        }
  
        h1 {
          font-size: 2.5rem;
          text-align: center;
        }
  
        table {
          font-size: 2rem;
        }
  
        th {
          text-align: right;
        }
      </style>
    </head>
    <body>
      <article>
        <h1>Loan Calculator</h1>
        <table>
          <tbody>
  `;

  const HTML_END = `
          </tbody>
        </table>
      </article>
    </body>
  </html>`;

  return HTML_START + dynamicContent + HTML_END;
}

// HTTP server
const SERVER = HTTP.createServer((req, res) => {
  const path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    let content = generateContent(getParams(path));
    let HTML = generateHTML(content)
    res.write(`${HTML}`); // HTTP/1.1 bodies end with new line
    res.statusCode = 200;
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});