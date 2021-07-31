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

export default router