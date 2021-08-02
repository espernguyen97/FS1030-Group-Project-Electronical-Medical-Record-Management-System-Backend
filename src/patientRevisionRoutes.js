//Dependency imports:
import express from 'express' ;
import dotenv from 'dotenv' ;
dotenv.config();

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;

//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

//4. Routes for patient revision history

/*Note: it's set up in the database so that when a patient is deleted then all of their associated revision history will also be deleted. 
Note2: I don't think there's any need for delete/update of individual items in the revision_history table as that would tamper 
with records and traceability. If a user makes a mistake in editing a patient's details then they could just make another edit. SW*/

//>>>4.A) route to add one or more revisions to a patient's details:
router.post('/patient-revisions', jwtVerify, async (req, res, next) => {
    const {UserID, PatientID, Revisions} = req.body;
    let mysqlQuery = "INSERT INTO revision_history (UserID, PatientID, Revision) VALUES";
    Revisions.forEach(revision => {
        let newValue = ` (${UserID}, ${PatientID}, "${revision}"),`;
        mysqlQuery = mysqlQuery + newValue;
    })
    mysqlQuery = mysqlQuery.slice(0, -1); //used to remove the last comma in the string
    try {
        db.query(mysqlQuery,
            function (error, results, fields){
                if (error) throw error;
                return res.status(201).json("Success.");
            }
        );
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

//>>>4.B) route to get all revisions for a specific patient 
router.get('/patient-revisions/:PatientID', async (req, res, next) => {    
    try {
        database.query(
            `SELECT * FROM revision_history WHERE PatientID=${req.params.PatientID}`,
            function (error, results) {
                if (error) throw error;
                return res.json(results);
            }
        );
    } catch (err) {
        console.error(err);
        return next(err);
    };
});

export default router