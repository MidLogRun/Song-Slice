// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************
// Example with Express.js
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server.
const { localsName } = require('ejs');
const { application } = require('express');
const port = 3000;




// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************
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



// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

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

// //**Not sure what this is: */
// const path = require('path');
// // Set the views directory
//  app.set('views', path.join(__dirname, 'src', 'views', 'pages'));


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************



// Redirect root URL to /login
app.get('/', (req, res) => {
    res.redirect('/login');
});



// //***********************LOGIN */
// Login - GET route
app.get('/login', (req, res) => {
  res.render('pages/login');
});


// login POST routine:
app.post('/login', async (req, res) =>
{
  const usrname = req.body.username;
  const password = req.body.password;

  const userQuery = 'SELECT * FROM users WHERE username = $1';
  console.log('Generated SQL Query:', userQuery, [usrname]);

  try
  {
    if (!usrname || !password)
    {
      return res.render('pages/login', { message: 'Username and password are both required for login' });
    }

    const user = await db.oneOrNone(userQuery, [usrname]);

    console.log('Attempting login for username:', usrname);


    if (!user)
    {
      //if username is not in DB:
      console.log("Username not found");
      return res.render('pages/login', { message: 'Username provided was not found. Please try again or register by clicking the link below!' });
    }

    const passValid = await bcrypt.compare(password, user.password);
    if (!passValid)
    {
      return res.render('pages/login', { message: 'Password is invalid' });
    }

    req.session.user = user;
    req.session.save();


    return res.redirect('pages/home');


  } catch (error)
  {
     console.error('Error during login', error.message);
     res.status(500).json({ message: 'Login failed (Entered catch block)' });
  }
});


// //***********************REGISTER */
// Register - GET route
app.get('/register', (req, res) => {
  res.render('pages/register');
});




// // register POST routine:
// app.post('/register', async (req, res) =>
// {
//   //  const userPassword = req.body.password;
//   // const username = req.body.username;

//   // if (!userPassword)
//   // {
//   //  return res.render('pages/register', { message: 'You need to enter a password'}); //correct path is?
//   // }

//   // if (!username)
//   // {
//   //  return res.render('pages/register', { message: 'You need to enter a username'}); //correct path is?
//   // }

//   // try {
//   //   const saltRounds = 10;
//   //   console.log("user password is: " + userPassword);
//   //   const hashWord = await bcrypt.hash(userPassword, saltRounds); // Hash the password

//   //   const insertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)'; // SQL Query to insert user

//   //   //insert the user into database
//   //   const result = await db.none(insertUser, [
//   //     username,
//   //     hashWord
//   //   ]);

//   //   res.render('pages/login'); //redirect the user to login

//   // } catch (error) {
//   //   console.error('Error saving user info: ', error);
//   //   res.render('pages/register',{error})
//   // }
// });

// //***********************LOGOUT */

// //Logout GET routine:
// app.get('/logout', (req, res) =>
// {
//   let message = 'You cannot log out if you cannot logged in.';
//   // if (req.session)
//   // {
//   //   message = 'You have logged out.';
//   //   //delete session object if exists
//   //   req.session.destroy();

//   //   res.render('pages/login', {message});
//   // }

//   // res.render('pages/login', {
//   //   message
//   // });

// });


// //Home page (only works when we have spotify API):
// app.get('/home', async (req, res) =>
// {
//   try
//   {

//   } catch (error)
//   {

//   }
// });



// *****************************************************
// <!-- Section 5 : Start Server -->
// *****************************************************
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});