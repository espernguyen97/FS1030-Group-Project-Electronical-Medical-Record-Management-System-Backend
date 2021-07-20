//Dependency imports:
import express from 'express' ;
import path from 'path' ;
import dotenv from 'dotenv' ;
dotenv.config();
import { v4 as uuidv4 } from 'uuid'; // function uuidv4() to create a random uuid

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;
import * as dataHandler from './util/dataHandler.js' ;

//setup Data paths
const PatientsDataPath = path.resolve(process.env.PATIENT_LOCATION);
//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

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
    db.query(
        "SELECT * FROM patient",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
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

export default router