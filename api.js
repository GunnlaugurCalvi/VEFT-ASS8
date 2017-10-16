const express = require('express');
const bodyParser = require('body-parser');
const entities = require('./entities');
// const Companies = require('./entities');
// const Punches = require('./entities');
const uuid = require('uuid');
const mongoose = require('mongoose');


 // Application setup
const router = express.Router();
const jsonParser = bodyParser.json();
const adminToken = 'admin';
// Defining data structures for companies and users in punchcard.com

router.get('/companies', function (req, res) {
    console.log("asdf");
    entities.Companies.find({}).exec((err, data) =>{
        if(err){
            res.status(500).json("ERROR FAILED TO FETCH FROM DATABASE!");
        }
        const filteredData = data.map(comps => ({
            name: comps.name,
            punchCount: comps.punchCount,
            id: comps._id
        }));
        res.json({comps: filteredData});
    });
});

// Gets a specific company, given a valid id
router.get('/companies/:id', function (req, res) {

    entities.Companies.find({'_id': req.params.id}).exec((err, data) => {
        if(err){
            res.status(500).json("internal errr");
        }
        if(data == null){
            res.status(404).json("COMPANY NOTT DOUND");
        }
        const filteredSelectedData = data.map(comp => ({
            name: comp.name,
            punchCount: comp.punchCount,
            id: comp._id
        }));
        res.json({comp: filteredSelectedData});
    })
});



// Registers a new company to the punchcard.com service
router.post('/companies', jsonParser, (req, res) => {
    console.log("prump");
    if(req.headers.authorization !== adminToken){
        res.status(401).json({error: "auth denied!"});
    }
    else{
        const comp = new entities.Companies({
            "name": req.body.name,
            "punchCount": req.body.punchCount
          });
        
        comp.save((err) => {
            if(err){
                if(err.name || err.punchCount){
                    res.status(412).json("Precondition failed!");
                }
                res.status(500).json("internal error!");
            }
            res.status(201).json(comp);
        })
    }
});




// // Gets all users in the system
// router.get('/users', function (req, res) {
//     return res.json(users);
// });

// // Creates a new user in the system
// router.post('/users', function (req, res) {
//     if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('email')) {
//         res.statusCode = 400;
//         return res.send('User was not properly formatted');
//     }
//     var newUser = {
//         id: users.length + 1,
//         name: req.body.name,
//         email: req.body.email 
//     }
//     users.push(newUser);

//     res.json(true);
// });

// // Returns a list of all punches, registered for the given user
// router.get('/users/:id/punches', function (req, res) {
//     if (!isValidUser(req.params.id)) {
//         res.statusCode = 404;
//         return res.send('User with given id was not found in the system.');
//     }
//     // There was a ?company query provided
//     if (req.query.company) {
//         var filteredPunches = punches.get(req.params.id);
//         if (filteredPunches) {
//             // The user already has some punches in his list
//             var returnList = [];
//             filteredPunches.forEach(function (value, idx) {
//                 if (value.companyId == req.query.company) {
//                     returnList.push(value);
//                 }
//             });
//             return res.json(returnList);
//         } else {
//             return res.json([]);
//         }
//     } else {
//         var retrievedPunches = punches.get(req.params.id) === undefined ? [] : punches.get(req.params.id);
//         return res.json(retrievedPunches);
//     }
// });

// // Creates a punch, associated with a user
// router.post('/users/:id/punches', function (req, res) {
//     if (!req.body.hasOwnProperty('companyId')) {
//         res.statusCode = 400;
//         return res.send('Company Id is missing');
//     } else if (!isValidUser(req.params.id)) {
//         res.statusCode = 404;
//         return res.send('The user was not found in the system.');
//     } else if (!isValidCompany(req.body.companyId)) {
//         res.statusCode = 404;
//         return res.send('The company with the given id was not found in the system.');
//     }

//     // We have valid data
//     var oldPunches = punches.get(req.params.id) === undefined ? [] : punches.get(req.params.id);
//     oldPunches.push({
//         companyId: req.body.companyId,
//         companyName: getCompanyNameById(req.body.companyId),
//         created: new Date().toLocaleString()
//     });
//     punches.set(req.params.id, oldPunches);

//     res.json(true);
//

// // Helper functions

// Company functions


  function isValidCompany(companyId) {
    for (var i = 0; i < companies.length; i++) {
        if (companies[i].id == companyId) {
            return true;
        }
    }
    return false;
}

// User functions

function isValidUser(userId) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            return true;
        }
    }
    return false;
}



// function getCompanyNameById(companyId) {
//     for (var i = 0; i < companies.length; i++) {
//         if (companies[i].id == companyId) {
//             return companies[i].name;
//         }
//     }
//     return "";
// }

module.exports = router;