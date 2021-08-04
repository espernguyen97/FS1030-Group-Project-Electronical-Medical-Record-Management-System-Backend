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

//3. Routes for medical_history
//>>>3.A) route to create a new medical_history:
router.post('/medical_history', async (req, res, next) => { //TODO add validation middleware
    db.query("INSERT INTO medical_history(PatientID,Username,Date,Fever,Allergies,XrayURL,Covid_Checked,LabResults,Prescriptions,BillStatus,Insurance_Provider,InsuredStatus,Smoker,Chronic_Pain,Past_Procedures,Weight,Imunizations) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [   
        req.body.PatientID,
        req.body.Username,
        req.body.Date,
        req.body.Fever,
        req.body.Allergies,
        req.body.XrayURL,
        req.body.Covid_Checked,
        req.body.LabResults,
        req.body.BillStatus,
        req.body.Imunizations,
        req.body.Insurance_Provider,
        req.body.InsuredStatus,
        req.body.Smoker,
        req.body.Chronic_Pain,
        req.body.Past_Procedures,
        req.body.Weight,
        req.body.Prescriptions
    ],
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
});
//>>>3.B) route to get a listing of all medical_history when a valid JWT is provided:
router.get('/medical_history', jwtVerify, async (req, res, next) => {
    db.query(
        "SELECT * FROM medical_history ORDER BY Date DESC",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});
//>>>3.C) route to get a specific medical_history when given an ID alongside a valid JWT:
router.get('/medical_history/:id', jwtVerify, async (req, res, next) => {
    db.query(`SELECT * FROM medical_history WHERE PatientID=${req.params.id}`, function(error, results) {
        if (error) throw error;
        return res.status(200).send(results);
    })
});
//3.D) route to delete a specific medical_history when given an ID alongside a valid JWT:
router.delete('/medical_history/:id', jwtVerify, async (req, res, next) => {
    db.query(`DELETE FROM medical_history WHERE PatientID=${req.params.id}`, function (error, results) {
        if (error) throw error
        return res.status(200).send(results)
    })
});

//3.E) route to update a specific medical_history when given an ID alongside a valid JWT:
router.patch("/medical_history/:id", jwtVerify, async (req, res, next) => {
    const {PatientID, Username, Date} = req.body
    db.query(`UPDATE medical_history SET
    PatientID = "${PatientID}",
    Username = "${Username}",
    Date = "${Date}",
    Fever = "${Fever}",
    Allergies = "${Allergies}",
    XrayURL = "${XrayURL}",
    Covid_Checked = "${Covid_Checked}",
    BillStatus = "${BillStatus}",
    Imunizations = "${Imunizations}",
    Insurance_Provider = "${Insurance_Provider}",
    InsuredStatus = "${InsuredStatus}",
    Smoker = "${Smoker}",
    Chronic_Pain = "${Chronic_Pain}",
    Past_Procedures = "${Past_Procedures}",
    Weight = "${Weight}",
    LabResults = "${LabResults}",
    Prescriptions = "${Prescriptions}",
    WHERE
    Medical_H = "${req.params.id}"`,
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
}); 


export default router