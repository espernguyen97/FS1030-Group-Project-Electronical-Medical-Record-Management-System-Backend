//Dependency imports:
import express from 'express' ;
import jwt from 'jsonwebtoken' ;
import path from 'path' ;
import dotenv from 'dotenv' ;
dotenv.config();
import { v4 as uuidv4 } from 'uuid'; // function uuidv4() to create a random uuid

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;
import * as dataHandler from './util/dataHandler.js' ;
import { verifyHash, createHash } from './util/hasher.js' ;
import { validateUser } from './middleware/validation.js' ;

//setup Data paths
const UsersDataPath = path.resolve(process.env.USER_LOCATION);
//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

//1. Routes for users
//>>>1.A) route to create a new user:
/*(note: an admin should be logged in to create a new care provider, hence the use of jwtVerify.
Otherwise anyone could create a new account.)*/
router.post('/users', jwtVerify, validateUser, (req, res, next) => {
    let password = req.body.password;
    createHash(password).then(hash => {
        req.body.password = hash;
        const newUser = {
            id: uuidv4(),
            ...req.body
        }; 
        return newUser;            
    }).then(async (newUser) => {
        try {
            await dataHandler.addData(UsersDataPath, newUser);
            delete newUser.password;
            return res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            return next(err);
        };
    });    
});
//>>>1.B) route to log in a registered user to create a JWT:
router.post('/auth', async (req, res) => {
    let users = await dataHandler.getAll(UsersDataPath);
    let user = users.find(user => user.email == req.body.email);
    //In the event the email or password does not match:    
    if (user == undefined) {
        return res.status(401).json({message: "incorrect credentials provided"});
    };  
    let password = req.body.password;
    let storedHash = user.password;
    verifyHash(password, storedHash).then(valid => {
        if (!valid) {
            return res.status(401).json({message: "incorrect credentials provided"});
        };
        //Upon successful login: 
        const userEmail = req.body.email;
        const token = jwt.sign({userEmail}, process.env.JWT_SECRET, {expiresIn: "2h"});      
        return res.json({token});
    });
});
//>>>1.C) route to get a listing of all users when a valid JWT is provided:
router.get('/users', jwtVerify, async (req, res, next) => {
    db.query(
        "SELECT * FROM users",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
  });
//>>>1.D) route to get a specific user when given an ID alongside a valid JWT:
router.get('/users/:id', jwtVerify, async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(UsersDataPath);
        let entry = entries.find(entry => entry.id == req.params.id);
        if (entry == undefined) {
            return res.status(404).json({message: `entry ${req.params.id} not found`});
        };
        return res.json(entry);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//1.E) route to delete a specific user when given an ID alongside a valid JWT:
router.delete('/users/:id', jwtVerify, async (req, res, next) => {
    try {
        let userID = req.params.id;
        let removed = await dataHandler.removeData(UsersDataPath, userID);
        if (!removed){
            return res.status(404).json({message: `entry ${userID} not found`});
        };
        return res.status(204).json() // it is an empty response as this resource no longer exists
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//1.F) route to update a specific user when given an ID alongside a valid JWT:
router.patch("/users/:id", jwtVerify, validateUser, async (req, res, next) => {
    try {
        let userID = req.params.id;
        let updated = await dataHandler.updateData(UsersDataPath, req.body, userID);
        if (!updated){
            return res.status(404).json({message: `entry ${userID} not found`});
        };
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});

export default router