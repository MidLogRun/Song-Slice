// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************
// Example with Express.js
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
//const bcrypt = require('bcrypt'); //  To hash passwords
//const axios = require('axios'); // To make HTTP requests from our server.
// const { localsName } = require('ejs');
// const { application } = require('express');
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

// Login - GET route
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Redirect root URL to /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Register - GET route
app.get('/register', (req, res) => {
  res.render('pages/register');
});

// // Register - POST route
// app.post('/register', async (req, res) => {
//   try {
//     // Hash the password using bcrypt library
//     const hash = await bcrypt.hash(req.body.password, 10);


//     // Insert username and hashed password into the 'users' table
//     // Assuming you have a 'users' table and a 'db' object connected to your database
//     await db.none('INSERT INTO users(username, password) VALUES($1, $2)', [req.body.username, hash]);

//     // Redirect to GET /login route page after data has been inserted successfully
//     res.render('pages/login');
//   } catch (error) {
//     // If the insert fails, redirect to GET /register route
//     console.error('Error during registration:', error);
//     res.redirect('/register');
//   }
// });

// // Login - POST route
// app.post('/login', async (req, res) => {
//   try {
//     // Find the user from the users table where the username is the same as the one entered by the user
//     const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

//     // If the user is not found in the table, redirect to GET /register route
//     if (!user) {
//       throw new Error('Incorrect username or password.');
//     }

//     // Use bcrypt.compare to compare if the entered password is the same as the registered one
//     const match = await bcrypt.compare(req.body.password, user.password);

//     // If the password is incorrect, throw an error stating "Incorrect username or password."
//     if (!match) {
//       throw new Error('Incorrect username or password.');
//     }

//     // Save the user in the session variable
//     req.session.user = user;
//     req.session.save();

//     // If the user is found, redirect to /discover route after setting the session
//     res.redirect('/discover');
//   } catch (error) {
//     // If the database request fails or the credentials are incorrect, send an appropriate message to the user and render the login.ejs page
//     console.error('Error during login:', error.message);
//     res.redirect('/login');
//   }
// });


// //***********************LOGIN */

// // login GET routine:
// app.get('/', (req, res) => {
//   res.redirect('login');
// });

// // Login - GET route
// app.get('/login', (req, res) => {
//   res.render('pages/login');
// });


// // login POST routine:
// app.post('/login', async (req, res) =>
// {
//   const username = req.body.username;
//   const password = req.body.password;

//   try
//   {

//   } catch (error)
//   {

//   }
// });


// //***********************REGISTER */
// // register GET routine:
// app.get('/register', (req, res) =>
// {
//   // res.render('register'); //not sure the correct path to register (ie: pages/register)
// });

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