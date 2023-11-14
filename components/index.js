// Example with Express.js
const express = require('express');
const app = express();
const pgp = require('pg-promise')(); //
const bodyParser = require('body-parser');
const session = require('express-session');
//const bcrypt = require('bcrypt');
//const axios = require('axios');
// const { localsName } = require('ejs');
// const { application } = require('express');
const port = 3000;



// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });



//  *********App Settings

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//**Not sure what this is: */
const path = require('path');
// Set the views directory
 app.set('views', path.join(__dirname, 'src', 'views', 'pages'));
//** ^^^^^^^^^^^^^ */




// login GET routine:
app.get('/', (req, res) => {
  res.render('login');
});

// login POST routine:
app.post('/login', async (req, res) =>
{
  const username = req.body.username;
  const password = req.body.password;

  try
  {

  } catch (error)
  {

  }
})



//Start server:
app.listen(3000);
console.log('Server is listening on port 3000');