const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('hello_world');
});

app.listen(3000, "localhost", () => {
  console.log("Listening on port 3000...");
})