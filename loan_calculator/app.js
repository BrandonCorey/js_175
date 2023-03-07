const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;
const HANDLEBARS = require('handlebars');

const SOURCE = `
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
        font-size: 1.5rem;
      }
      th {
        text-align: right;
      }
      td {
        text-align: center;
      }
      th,
      td {
        padding: 0.5rem;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>
              <a href='/?amount={{amountDecrement}}&duration={{duration}}'>- $100</a>
            </td>
            <td>$ {{amount}}</td>
            <td>
              <a href='/?amount={{amountIncrement}}&duration={{duration}}'>+ $100</a>
            </td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>
              <a href='/?amount={{amount}}&duration={{durationDecrement}}'>- 1 year</a>
            </td>
            <td>{{duration}} years</td>
            <td>
              <a href='/?amount={{amount}}&duration={{durationIncrement}}'>+ 1 year</a>
            </td>
          </tr>
          <tr>
            <th>APR:</th>
            <td colspan='3'>{{apr}}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td colspan='3'>$ {{payment}}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </body>
</html>
`;

// Application server
const LOAN_OFFER_TEMPLATE = HANDLEBARS.compile(SOURCE); // method provided by module
                                                        // returns a function that takes a data object as arg, and returns HTML with data interpolated
                                                        // returned function expects data object to have props of same name as placeholder values in SOURCE

const render = (template, data) => {
  let html = template(data) // the template function argument will be LOAN_OFFER_TEMPLATE
  return html;
}

const getParams = (path) => {
  const url = new URL(path, `http://localhost:${PORT}`);
  return url.searchParams;
};

const calcPayment = (amount, APR, years) => {
  let interest = (APR / 100) / 12;
  let months = years * 12;
  return amount * (interest / (1 - Math.pow((1 + interest), (-months))));
};

const createLoan = (params) => {
  const APR = 5;
  let data = {};

  data.amount = Number(params.get('amount'));
  data.amountIncrement = data.amount + 100;
  data.amountDecrement = data.amount - 100;
  data.duration = Number(params.get('duration'));
  data.durationIncrement = data.duration + 1;
  data.durationDecrement = data.duration - 1;
  data.apr = APR;
  data.payment = calcPayment(data.amount, data.apr, data.duration).toFixed(2);

  return data;
}

// HTTP server
const SERVER = HTTP.createServer((req, res) => {
  const path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    let data = createLoan(getParams(path));
    let content = render(LOAN_OFFER_TEMPLATE, data)
    res.write(`${content}\n`); // HTTP/1.1 bodies end with new line
    res.statusCode = 200;
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});