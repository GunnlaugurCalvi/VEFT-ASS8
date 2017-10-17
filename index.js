/*
    In order for this to successfully run, there are 3 steps that need to be taken
      1. npm install
      2. npm run babel
      3. npm start

    You can also do this in 2 steps, if you are in a big big hurry
      1. npm install
      2. npm run execute

    After that the server runs on http://localhost:5001
*/

const api = require('./api.js');
const entities = require('./entities.js');

const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');

var app = express();
app.use('/api', api);

// Define database connection
var url = 'mongodb://veft:123465@ds119355.mlab.com:19355/app'

// Connect to database
mongoose.connect(url, {useMongoClient: true}, (err) => {
  if(err){
    console.log("no connection -->" + err);
    return;
  }
  else{
    mongoose.Promise = global.Promise;
 
    console.log('Connected -->', url);
    
    // Initialize listen for app to listen on a specific port, either provided or hardcoded
    app.listen(5001, () => console.log('Server is running on port 5001'));
  }
});


