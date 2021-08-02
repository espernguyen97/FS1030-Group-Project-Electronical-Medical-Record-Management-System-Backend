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

//3. Routes for notes
//>>>3.A) route to create a new notes:
router.post('/notes', async (req, res, next) => { //TODO add validation middleware
    db.query("INSERT INTO notes(PatientID,Username,Date,Note) VALUES ( ?,?,?,?)",
    [   
        req.body.PatientID,
        req.body.Username,
        req.body.Date,
        req.body.Note
    ],
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
});
//>>>3.B) route to get a listing of all notes when a valid JWT is provided:
router.get('/notes', jwtVerify, async (req, res, next) => {
    db.query(
        "SELECT * FROM notes",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});
//>>>3.C) route to get a specific notes when given an ID alongside a valid JWT:
router.get('/notes/:id', jwtVerify, async (req, res, next) => {
    db.query(`SELECT * FROM notes WHERE noteID=${req.params.id}`, function(error, results) {
        if (error) throw error;
        return res.status(200).send(results);
    })
});
//3.D) route to delete a specific notes when given an ID alongside a valid JWT:
router.delete('/notes/:id', jwtVerify, async (req, res, next) => {
    db.query(`DELETE FROM notes WHERE noteID=${req.params.id}`, function (error, results) {
        if (error) throw error
        return res.status(200).send(results)
    })
});

//3.E) route to update a specific notes when given an ID alongside a valid JWT:
router.patch("/notes/:id", jwtVerify, async (req, res, next) => {
    const {PatientID, Username, Date} = req.body
    db.query(`UPDATE notes SET
    PatientID = "${PatientID}",
    Username = "${Username}",
    Date = "${Date}",
    Note = "${Note}",
    WHERE
    noteID = "${req.params.id}"`,
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
}); 


export default router