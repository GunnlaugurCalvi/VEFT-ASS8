const mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var users = new Schema({
    name: { type: String, required: true },         // Name of user
    token: { type: String, required: true },        // Autorization token
    gender: { type: Date, default: "o" }            // m,f or o
});

var companies = new Schema({
    name: { type: String, required: true },         // Name of user
    punchCount: { type: Number, default: 5 },       // Number of punches before discound
});

var punches = new Schema({
    company_id: Number,                             // Id of company           
    created: { type: Date, default: Date.now },     // Time stand when punch is created
    used: { type: Boolean, required: false }        // Indicated if the user has used his discound, true or false
});


module.exports = {
    Users: mongoose.model('Users', users),
    Companies: mongoose.model('Companies', companies),
    Punches: mongoose.model('Punches', punches)
  };