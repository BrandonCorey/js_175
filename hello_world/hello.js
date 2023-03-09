const express = require('express');
const morgan = require('morgan');
const app = express();

const COUNTRY_DATA = [
  {
    path: "/english",
    flag: "us_flag.png",
    alt: "US Flag",
    title: "Go to US English site",
  },
  {
    path: "/french",
    flag: "french_flag.png",
    alt: "Drapeau de la france",
    title: "Aller sur le site français",
  },
  {
    path: "/serbian",
    flag: "serbian_flag.png",
    alt: "Застава Србије",
    title: "Идите на српски сајт",
  },
];

const LANGUAGE_CODES = {
  english: "en-US",
  french: "fr-FR",
  serbian: "sr-Cryl-rs",
};

// setting views directory and view engine
app.set('views', './views');
app.set('view engine', 'pug');

// telling app to use middleware function express.static after each request is recieved
app.use(express.static('public'));
// telling app to log each requst after its recieved in the common format (IP, timestamp, method, path, body length)
app.use(morgan('common'));

// function to determine if requested resource is equal to a view's path
app.locals.currentPathClass = (path, currentPath) => {
  return path === currentPath ? 'current' : ''; // css styles based on if element class is "current"
}

app.get('/', (req, res) => {
  res.redirect('/english');
});

app.get('/:language', (req, res, next) => {
  const lang = req.params.language;
  const langCode = LANGUAGE_CODES[lang];

  if (!langCode) {
    next(new Error(`Language not supported: ${lang}`));
  } else {
    res.render(`hello_world_${lang}`, {
      countries: COUNTRY_DATA,
      language: LANGUAGE_CODES[lang],
      currentPath: req.originalURL,
    });
  }
});

// Error hander: middleware functions that accept 4 arguments instead of 3
// Must be the last middleware in app, and MUST have 4 parameters in the below order
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).render(`error_message`, {
    errorMessage: err.message,
  });
});

app.listen(3000, "localhost", () => {
  console.log("Listening on port 3000...");
})