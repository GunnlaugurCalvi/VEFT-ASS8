const express = require('express');
const bodyParser = require('body-parser');
const entities = require('./entities');
const uuid = require('uuid');
const mongoose = require('mongoose');


const router = express.Router();
const jsonParser = bodyParser.json();
const adminToken = 'admin';


router.get('/companies',  (req, res) => {
    entities.Companies.find({}).exec((err, data) =>{
        if(err){
            res.status(500).json({error:"ERROR FAILED TO FETCH FROM DATABASE!"});
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
router.get('/companies/:id', (req, res) => {

    entities.Companies.find({'_id': req.params.id}).exec((err, data) => {
        if(err){
            res.status(500).json({error:"internal errr"});
        }
        if(data == null){
            res.status(404).json({error:"COMPANY NOTT DOUND"});
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
        res.status(401).json({error: "Auth denied!"});
    }
    else{
        const comp = new entities.Companies({
            "name": req.body.name,
            "punchCount": req.body.punchCount
          });
        
        comp.save((err) => {
            if(err){
                if(err.name || err.punchCount){
                    res.status(412).json({error:"Precondition failed!"});
                }
                res.status(500).json({error:"Internal error!"});
            }
            res.status(201).json(comp);
        })
    }
});


// Creates a new user in the Database
router.post('/users', jsonParser, (req, res) => {
    if(req.headers.authorization !== adminToken){
        res.status(401).json({error: "Auth denied!"});
    }
    if(!req.body.name || !req.body.gender){
        res.status(412).json({error:"Precondition failed!"});
    }
    else if(!(req.body.gender.toString() === 'm'  || req.body.gender.toString() === "f" || req.body.gender.toString() === "o")){
        res.status(412).json({error:"Invalid gender!"});
    }
    const user = new entities.Users({
        "name": req.body.name,
        "gender": req.body.gender,
        "token": uuid.v1()
    });

    user.save((err) => {
        if(err){
            res.status(500).json({error:"Internal error!"});
        }
        res.status(201).json(user);            
    });
});

// Gets all users in the system
router.get('/users',  (req, res) => {
    entities.Users.find({}).exec((err, data) =>{
        if(err){
            res.status(500).json("Some issues from the inside, lol thats what she said");
        }
        const filterTokenOut = data.map(users => ({
            name: users.name,
            gender: users.gender,
            id: users._id
        }));

        res.status(200).json({users: filterTokenOut});
    });
});

// Creates a new punch for the "current user" for a given company, the company id should be
// passed in via the request body
router.post('/my/punches', jsonParser, (req, res) =>{
    entities.Users.find({'token': req.headers.authorization}).exec((err, data) => {
        if(err || data === null){
            res.status(401).json({error:"No user found by this token or token value is missing!"});
        }        

        entities.Companies.find({'_id': req.body.id}).exec((error, goods) => {
            if(error){
                res.status(500).json({error:"We are so sorry!"});
            }
            if(goods === null){
                res.status(404).json({error:"Nope, nonono company found!"});
            }   
            
            console.log()  // 
            const punch = new entities.Punches({
                "company_id": req.body.company_id,
                "user_id": data[0].toObject()._id,
                "created": req.body.created,
                "used": req.body.used 
            });
            
            console.log("MY DATA 2->>> " + data);
            
            punch.save((err) => {
                if(err){
                    res.status(500).json({error:"Something went wrong could not save punch!"});
                }
                res.status(201).json(punch);
            });
        });
    });
});

module.exports = router;