const mongoose = require('mongoose');

//Define schema
var Schema = mongoose.Schema;

// User schema
const users = new Schema({
    name: { type: String, required: true },            // Name of user
    gender: { type: String, default: "o" },            // m,f or o
    token: { type: String, required: true }            // Autorization token
});

// Company schema
const companies = new Schema({
    name: { type: String, required: true },             // Name of user
    punchCount: { type: Number, default: 10 },          // Number of punches before discound
});

// Punches schema
const punches = new Schema({
    company_id: String,                                 // Id of company  
    user_id: String,                                    // Id of user
    created: { type: Date, default: Date.now },         // Time stand when punch is created
    used: { type: Boolean, default: false },            // Indicated if the user has used his discound, true or false
    discount: {type: Boolean, default: false}           // Indicated if discount or not           
});


module.exports = {
    Users: mongoose.model('Users', users),
    Companies: mongoose.model('Companies', companies),
    Punches: mongoose.model('Punches', punches)
};