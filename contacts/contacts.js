"use strict";

const express = require('express');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const store = require('connect-loki');
const flash = require('express-flash');

const app = express();
const LokiStore = store(session);

const contactData = [
  {
    firstName: 'Mike',
    lastName: 'Jones',
    phoneNumber: '281-330-8004',
  },
  {
    firstName: "Jenny",
    lastName: "Keys",
    phoneNumber: "768-867-5309",
  },
  {
    firstName: "Max",
    lastName: "Entiger",
    phoneNumber: "214-748-3647",
  },
  {
    firstName: "Alicia",
    lastName: "Keys",
    phoneNumber: "515-489-4608",
  },
];

const sortContacts = (contacts) => {
  return [...contacts].sort((contactA, contactB) => {
    if (contactA.lastName > contactB.lastName) {
      return 1;
    } else if (contactA.lastName < contactB.lastName) {
      return -1;
    } else if (contactA.firstName > contactB.firstName) {
      return 1;
    } else if (contactA.firstName < contactB.firstName) {
      return -1;
    } else {
      return 0;
    }
  });
};

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('common'));

app.use(session({
  cookie: {
    httpOnly: true, // don't let browser access cookie
    maxAge: 1000 * 60 * 60 * 24 * 31, // 31 days in ms
    path: '/', // create/use cookie for requests to this path (so any path)
    secure: false, // allow for transfer over HTTP or HTTPS
  },
  name: 'contact-manager-session-id',
  resave: false,
  saveUninitialized: true,
  secret: 'not super duper secure',
  store: new LokiStore({}),
}));

app.use(flash());

// If we haven't added contactData to our store (req.session), add a copy of it
app.use((req, res, next) => {
  if (!('contactData' in req.session)) {
    req.session.contactData = clone(contactData);
  }
  next();
});

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/contacts');
});

app.get('/contacts', (req, res) => {
  res.render('contacts', {
    contacts: sortContacts(req.session.contactData),
  });
});

app.get('/contacts/new', (req, res) => {
  res.render('new_contact');
});

const validateName = (name, messageName) => {
  return body(name)
    .trim()
    .isLength({ min: 1 })
    .withMessage(`${messageName} name is required.`)
    .bail()
    .isLength({ max: 25 })
    .withMessage(`${messageName} name is limited to 25 characters.`)
    .isAlpha()
    .withMessage(`${messageName} name can only contain alphabetic characters.`);
};

// Validation middleware
app.post('/contacts/new',
  [
    validateName('firstName', 'First'),
    validateName('lastName', 'last'),
    body('phoneNumber')
      .isLength({ min: 1 })
      .withMessage('Phone number is required.')
      .bail()
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage('Invalid phone number: Use ###-###-####')
  ],
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(error => req.flash("error", error.msg));

      res.render('new_contact', {
        flash: req.flash(),
        firstName: req.body.prevFirstName,
        lastName: req.body.prevLastName,
        phoneNumber: req.body.prevPhoneNumber,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    req.session.contactData.push({...req.body});

    req.flash("success", "New contact added to list!");
    res.redirect('/contacts');
  }
);

app.listen(3000, 'localhost', () => {
  console.log('Listening on port 3000...');
});