// Example with Express.js
const express = require('express');
const app = express();
const port = 3000;




app.set("view engine", "ejs");

const path = require('path');

// Set the views directory
 app.set('views', path.join(__dirname, 'src', 'views', 'pages'));




app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});




app.get('/', (req, res) => {
  res.render('login'); 
});