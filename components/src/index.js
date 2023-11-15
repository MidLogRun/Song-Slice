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
 app.set('views', path.join(__dirname, 'views', 'pages'));
//** ^^^^^^^^^^^^^ */


//*************** /
// API Routes:
//************** */

//***********************REGISTER */
// register GET routine:
app.get('/register', (req, res) =>
{
  // res.render('register'); //not sure the correct path to register (ie: pages/register)
});

// register POST routine:
app.post('/register', async (req, res) =>
{
  //  const userPassword = req.body.password;
  // const username = req.body.username;

  // if (!userPassword)
  // {
  //  return res.render('pages/register', { message: 'You need to enter a password'}); //correct path is?
  // }

  // if (!username)
  // {
  //  return res.render('pages/register', { message: 'You need to enter a username'}); //correct path is?
  // }

  // try {
  //   const saltRounds = 10;
  //   console.log("user password is: " + userPassword);
  //   const hashWord = await bcrypt.hash(userPassword, saltRounds); // Hash the password

  //   const insertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)'; // SQL Query to insert user

  //   //insert the user into database
  //   const result = await db.none(insertUser, [
  //     username,
  //     hashWord
  //   ]);

  //   res.render('pages/login'); //redirect the user to login

  // } catch (error) {
  //   console.error('Error saving user info: ', error);
  //   res.render('pages/register',{error})
  // }
});

//***********************LOGIN */

// login GET routine:
app.get('/', (req, res) => {
  res.render('login');
});

// login POST routine:
app.post('/login', async (req, res) =>
{
  const username = req.body.username;
  const password = req.body.password;
  const userQuery = 'SELECT * FROM user WHERE username = $1';

  try {
    //User enters nothing for either field:
    if (!username || !password)
    {
      return res.render('pages/login', { message: 'Username and password are required!' }); //go back to login
    }

    const user = await db.oneOrNone(userQuery, [username]); //query the db for user that matches username

    //provided username doesn't exist in the db:
    if (!user)
    {
      console.log("Username not found!");
      return res.render('pages/login', { message: 'Username not found' }); //go back to login
    }

    const passwordValid = await bcrypt.compare(password, user.password); //either returns a password or null

    if (!passwordValid)
    {
      res.render('pages/login', { message: 'Please enter a valid password' });
      return;
    }
    else //the password is valid and user can login
    {
      req.session.user = user;
      req.session.save();

      //res.redirect('/home');
    }
  } catch (error) {
    console.error('Error during login', error);
    res.render('pages/login', { message: error });
  }
});

//***********************LOGOUT */

//Logout GET routine:
app.get('/logout', (req, res) =>
{
  let message = 'You cannot log out if you cannot logged in.';
  // if (req.session)
  // {
  //   message = 'You have logged out.';
  //   //delete session object if exists
  //   req.session.destroy();

  //   res.render('pages/login', {message});
  // }

  // res.render('pages/login', {
  //   message
  // });

});


//Home page (only works when we have spotify API):
app.get('/home', async (req, res) =>
{
  try
  {

  } catch (error)
  {

  }
});




//Start server:
app.listen(3000);
console.log('Server is listening on port 3000');