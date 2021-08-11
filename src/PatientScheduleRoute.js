//Dependency imports:
import express from 'express' ;
import dotenv from 'dotenv' ;
dotenv.config();

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;

//setup Data paths
//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

//3. Routes for schedule
//>>>3.A) route to create a new schedule:
router.post('/schedule', async (req, res, next) => { //TODO add validation middleware
    db.query("INSERT INTO schedule(TimeSlot,Date,PatientID,Username) VALUES ( ?,?,?,?)",
    [   
        req.body.TimeSlot,
        req.body.Date,
        req.body.PatientID,
        req.body.Username
    ],
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
});
//>>>3.B) route to get a listing of all schedule when a valid JWT is provided:
router.get('/schedule', jwtVerify, async (req, res, next) => {
    db.query(
        "SELECT * FROM schedule ORDER BY Date DESC",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});
//>>>3.C) route to get the schedule for a specific patient when given a patient ID alongside a valid JWT:
router.get('/schedule/:id', jwtVerify, async (req, res, next) => {
    db.query(`SELECT * FROM schedule WHERE PatientID=${req.params.id} ORDER BY STR_TO_DATE( Date, '%Y-%m-%d' ) DESC, Timeslot DESC`, 
    function(error, results) {
        if (error) throw error;
        return res.status(200).send(results);
    })
});
//3.D) route to delete a specific schedule when given an ID alongside a valid JWT:
router.delete('/schedule/:id', jwtVerify, async (req, res, next) => {
    db.query(`DELETE FROM schedule WHERE scheduleID=${req.params.id}`, function (error, results) {
        if (error) throw error
        return res.status(200).send(results)
    })
});

//3.E) route to update a specific schedule when given an ID alongside a valid JWT:
router.patch("/schedule/:id", jwtVerify, async (req, res, next) => {
    const {PatientID, Username, Date} = req.body
    db.query(`UPDATE schedule SET
    TimeSlot = "${TimeSlot}",
    Date = "${Date}",
    PatientID = "${PatientID}",
    Username = "${Username}",
    WHERE
    noteID = "${req.params.id}"`,
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
}); 



router.get('/appointmentSearch', jwtVerify, async (req, res, next) => {
    db.query(
        `SELECT * FROM schedule WHERE Username LIKE "%`+req.query.key+`%" OR Date LIKE "%`+req.query.key+`%" OR Timeslot LIKE "%`+req.query.key+`%"`,
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});

export default router