//Dependency imports:
import express from 'express' ;
import dotenv from 'dotenv' ;
dotenv.config();

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;
import * as dataHandler from './util/dataHandler.js' ;

//setup Data paths
//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

//3. Routes for patients
//>>>3.A) route to create a new patient:
router.post('/patients', async (req, res, next) => { //TODO add validation middleware
    db.query("INSERT INTO patient(DOB,OHIP,First_Name,Last_Name,Address,City,Province,PostalCode,Phone_Number,Email,Age,Last_edit) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?)",
    [   
        req.body.DOB,
        req.body.OHIP,
        req.body.First_Name,
        req.body.Last_Name,
        req.body.City,
        req.body.Address,
        req.body.Province,
        req.body.PostalCode,
        req.body.Phone_Number,
        req.body.Email,
        req.body.Age,
        req.body.Last_edit
    ],
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
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
    db.query(`SELECT * FROM patient WHERE PatientID=${req.params.id}`, function(error, results) {
        if (error) throw error;
        return res.status(200).send(results);
    })
});
//3.D) route to delete a specific patient when given an ID alongside a valid JWT:
router.delete('/patients/:id', jwtVerify, async (req, res, next) => {
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
    const {DOB, OHIP, First_Name, Last_Name, Address, City, Province, PostalCode, Phone_Number, Email} = req.body
    db.query(`UPDATE patient SET
    DOB = "${DOB}",
    OHIP = "${OHIP}",
    First_Name = "${First_Name}",
    Last_Name = "${Last_Name}",
    Address = "${Address}",
    City = "${City}",
    Province = "${Province}",
    PostalCode = "${PostalCode}",
    Phone_Number = "${Phone_Number}",
    Email = "${Email}" 
    WHERE
    PatientID = ${req.params.id}`,
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
}); 


export default router