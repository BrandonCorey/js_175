"use strict"

const express = require('express');
const morgan = require('morgan');
const app = express();

let contactData = [
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
]

const sortContacts = (contacts) => {
  return [...contacts].sort((contactA, contactB) => {
    if (contactA.lastName > contactB.lastName) {
      return 1;
    } else if (contactA.lastName < contactB.lastName) {
      return -1;
    } else if (contactA.firstName > contactB.firstName) {
      return 1;
    } else if (contactB.firstName < contactB.firstName) {
      return -1;
    } else {
      return 0;
    }
  });
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false })); // need body parsing middle express.urlencoded to populate req.body with user input, which is undefined by default
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.redirect('/contacts')
});

app.get('/contacts', (req, res) => {
  res.render('contacts', {
    contacts: contactData,
  })
});

app.get('/contacts/new', (req, res) => {
  res.render('new_contact');
});

app.post('/contacts/new', (req, res) => {
  console.log(req.body) // ==> { firstName: Brandon, lastName: Corey, phoneNumber: 123, 456, 8910 }
  contactData.push({...req.body}); // spread so we make a copy of the body object of the request

  res.redirect('/contacts');
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});