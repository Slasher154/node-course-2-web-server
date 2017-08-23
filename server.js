const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// process.env.PORT will work on Heroku or machine that set the environment variable
// but it won't work on local machine (there is no PORT in env variable). We need to set default port to 3000.
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Register middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Register HTTP route handlers
// GET request
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Sneeze',
    welcomeMessage: 'Hi man'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page 222',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill this request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
