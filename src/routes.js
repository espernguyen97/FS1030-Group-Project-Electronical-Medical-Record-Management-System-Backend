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
const TicketPostDataPath = path.resolve(process.env.TICKET_DATA_PATH);

const router = express.Router() ;

/*As this file gets bigger we can split it into separate js files for each
section of routes (ex: usersRoutes.js, patientsRoutes.js, etc.) SW*/
  
//1. Routes for users
//>>>1.A) route to create a new user:
router.post('/users', validateUser, (req, res, next) => {
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
        const token = jwt.sign({userEmail}, process.env.JWT_SECRET, {expiresIn: "1h"});      
        return res.json({token});
    });
});


//2. Routes for tickets
//>>>2.A) route to create a new ticket:
router.post('/tickets/entries', async (req, res, next) => {
    const newEntry = {
        id: uuidv4(),
        ...req.body
    };
    try {
        await dataHandler.addData(TicketPostDataPath, newEntry);
        return res.status(201).json(newEntry);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//2.B) route to get a listing of all tickets
router.get('/tickets/entries', async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(TicketPostDataPath);
        return res.json(entries);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//2.C) route to get a specific ticket submission when given an ID alongside a valid JWT:
router.get('/tickets/entries/:id', jwtVerify, async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(TicketPostDataPath);
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


export default router
