import express from 'express' ;
import jwt from 'jsonwebtoken' ;
import path from 'path' ;
import jwtVerify from './middleware/jwtVerify.js' ;
import * as dataHandler from './util/dataHandler.js' ;
import dotenv from 'dotenv' ;
dotenv.config();
import { verifyHash,createHash, } from './Encrupter.js' ;
import {validateUser } from './middleware/validation.js' ;
import { v4 as uuidv4 } from 'uuid';

//setup Data paths
const UsersDataPath = path.resolve(process.env.USER_LOCATION);
const TicketPostDataPath = path.resolve(process.env.TICKET_DATA_PATH);
const router = express.Router() ;

  
//** users**//
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

  
//** Auth**//
router.post('/auth', async (req, res) => {
    let users = await dataHandler.getAll(UsersDataPath);
    let user = users.find(user => user.email == req.body.email);    
    if (user == undefined) {
        return res.status(401).json({message: "Wrong"});
    };  
    let password = req.body.password;
    let storedHash = user.password;
    verifyHash(password, storedHash).then(valid => {
        if (!valid) {
            return res.status(401).json({message: "Wrong"});
        };
        const userEmail = req.body.email;
        const token = jwt.sign({userEmail}, process.env.JWT_SECRET, {expiresIn: "1h"});      
        return res.json({token});
    });
});



//**TICKET ROUTES**//
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

router.get('/tickets/entries', async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(TicketPostDataPath);
        return res.json(entries);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});

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
