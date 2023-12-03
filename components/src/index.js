// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************
// Example with Express.js
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const qs = require('qs');
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server.
const { localsName } = require('ejs');
const { application } = require('express');
const port = 3000;

const SpotifyWebAPi = require('spotify-web-api-node'); //wrapper for spotify web api


///Album ID holders (holds these ids from Spotify)
const AlbumURLs = {
  Album1: 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy',
  Album2: 'https://api.spotify.com/v1/album/18NOKLkZETa4sWwLMIm0UZ'

};




/******** Section 1.5 */
//Mount Spotify API:
const client_id = process.env.CLIENT_ID; //client id
const client_secret = process.env.CLIENT_SECRET; //client secret
//const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64'); //Auth token to give to spotify

const spotifyApi = new SpotifyWebAPi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

//Retrieving access token:
/* The JSON body returned from Spotify looks like this:
    {
      "access_token": "NgCXRKc...MzYjw",
      "token_type": "bearer",
      "expires_in": 3600
    }
*/
spotifyApi
  .clientCredentialsGrant() //we are using client credentials OAuth flow (no need to have redirect URI)
  .then(data =>
  {
    console.log("spotifyApi data body: " + data.body);
    spotifyApi.setAccessToken(data.body["access_token"]);

  })
  .catch(error =>
  {
    console.error("Something went wrong when retrieving an access token", error);
  })


/**************** */
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
app.use('/resources', express.static('./resources'));

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


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

//Dummy Route:
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

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
      console.log("Password is invalid");
      return res.render('pages/login', { message: 'Password is invalid' });
    }

    console.log("User logged in successfully");

    req.session.user = user;
    req.session.save();

    //res.json({status: 'Login success!', message: 'Welcome!'});
    return res.redirect('/release');


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

// register POST routine:
app.post('/register', async (req, res) =>
{
   const userPassword = req.body.password;
  const username = req.body.username;

  if (!userPassword)
  {
   return res.render('pages/register', { message: 'You need to enter a password'}); //correct path is?
  }

  if (!username)
  {
   return res.render('pages/register', { message: 'You need to enter a username'}); //correct path is?
  }

  try {
    const saltRounds = 10;
    console.log("user password is: " + userPassword);
    const hashWord = await bcrypt.hash(userPassword, saltRounds); // Hash the password

    const insertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)'; // SQL Query to insert user

    //insert the user into database
    const result = await db.none(insertUser, [
      username,
      hashWord
    ]);

    console.log("User registered successfully.");
    //Save session info
    req.session.user = insertUser;
    req.session.save();
    return res.redirect('/home'); //redirect the user to the home page

  } catch (error) {
    console.error('Error saving user info: ', error);
    res.render('pages/register',{message: 'An error occurred while registering the user.'})
  }
});


// Authentication Middleware:
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page if no user session:
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);




// //***********************HOME */
app.get('/home', (req, res) => {
  try
  {
    res.render('pages/home');
  } catch (error) {
    console.error('Error saving user info: ', error);
  }
});

// app.post('/home', (req, res) => {

// });


// //***********************LOGOUT */

//Logout GET routine:
app.get('/logout', (req, res) =>
{

  if (req.session)
  {
    //delete session object if exists
    req.session.destroy();

    console.log("User has successfully logged out");
    return res.redirect('/home');
  }

  return res.redirect('/login');

});



/**
 * OAuth to Spotify
 * The following function verifies our client credentials and secret in order to create a
 * token for us to use in our Spotify endpoints
 *
 */



//Spotify Get Albums:
//https://api.spotify.com/v1/albums


/////////////// Beginning of release function

// app.get('/release', async  (req, res) =>
// {
//   var token = await getAuth();
//   const apiURL = `https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy`;
//   try {
//     const response = await axios.get(apiURL, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (response.status === 200)
//     {
//       const albums = response.data;
//       console.log("Logging response data: " + albums);

//       res.render('pages/release', {
//         albums
//       }); //Render the release page with JSON data (albums)
//     }
//     else
//     {
//       res.render('pages/release', {
//         albums: [],
//         errorMessage: `API request failed with status code: ${response.status}`,
//       });
//     }
//   }
//   catch (error)
//   {
//     console.error('!!!!!!!!!!Error during Spotify API routine:', error);
//     console.error("Error status:", error.response.status);
//     console.error("Error data:", error.response.data);
//     res.render('pages/release', {
//       albums: [],
//       errorMessage: 'An error occurred while fetching albums.',
//     });
//   }
// });


app.get('/release', (req, res, next) =>
{
  spotifyApi.getAlbum('18NOKLkZETa4sWwLMIm0UZ')
    .then(
      function (data)
      {
       // let image = data.body.images[0];
        res.render('pages/release', { image: data.body.images[0].url, albumName: data.body.name, artist: data.body.artists[0].name, tracks: data.body.tracks});
      },
      function (error)
      {
        console.error("This error happened", error);
      }
  )
})


// *****************************************************
// <!-- Section 5 : Start Server -->
// *****************************************************
 module.exports = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});