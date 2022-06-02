const path = require('path');

const express = require('express');

const hobby = require('./routes/hobby');
const db = require('./data/database')
const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use(hobby);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('fivehundred');
});

db.connectToDatabase().then(function(){
  app.listen(3000)
});
