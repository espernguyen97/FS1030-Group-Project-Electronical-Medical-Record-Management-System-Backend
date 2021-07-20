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
const PatientsDataPath = path.resolve(process.env.PATIENT_LOCATION);

const router = express.Router() ;

/*TODO: As this file gets bigger we can split it into separate js files for each
section of routes (ex: usersRoutes.js, patientsRoutes.js, etc.) SW*/
  
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
    try {
        let entries = await dataHandler.getAll(UsersDataPath);
        return res.json(entries);
    } catch (err) {
        console.error(err);
        return next(err);
    };
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
//2.B) route to get a listing of all tickets:
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


//3. Routes for patients
//>>>3.A) route to create a new patient:
router.post('/patients', async (req, res, next) => { //TODO add validation middleware
    const newPatient = req.body      
    try {
        await dataHandler.addData(PatientsDataPath, newPatient);
        return res.status(201).json(newPatient);
    } catch (err) {
        console.error(err);
        return next(err);
    };   
});
//>>>3.B) route to get a listing of all patients when a valid JWT is provided:
router.get('/patients', jwtVerify, async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(PatientsDataPath);
        return res.json(entries);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//>>>3.C) route to get a specific patient when given an ID alongside a valid JWT:
router.get('/patients/:id', jwtVerify, async (req, res, next) => {
    try {
        let entries = await dataHandler.getAll(PatientsDataPath);
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
//3.D) route to delete a specific patient when given an ID alongside a valid JWT:
router.delete('patients/:id', jwtVerify, async (req, res, next) => {
    try {
        let patientID = req.params.id;
        let removed = await dataHandler.removeData(PatientsDataPath, patientID);
        if (!removed){
            return res.status(404).json({message: `entry ${patientID} not found`});
        };
        return res.status(204).json() // it is an empty response as this resource no longer exists
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//3.E) route to update a specific patient when given an ID alongside a valid JWT:
router.patch("/patients/:id", jwtVerify, async (req, res, next) => {
    try {
        let patientID = req.params.id;
        let updated = await dataHandler.updateData(PatientsDataPath, req.body, patientID);
        if (!updated){
            return res.status(404).json({message: `entry ${patientID} not found`});
        };
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return next(err);
    };
});

//4. TODO define routes for patient notes (create, read)

//5. TODO define routes for patient records (create, read)

//6. TODO define routes for patient revision history (create, read)

export default router
