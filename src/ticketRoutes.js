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

//2. Routes for tickets
//>>>2.A) route to create a new ticket:
router.post('/tickets/entries', async (req, res, next) => {
    db.query("INSERT INTO tickets(Username,email,Date,content,TicketNumber) VALUES ( ?,?,?,?,?)",
    [   
        req.body.Username,
        req.body.email,
        req.body.Date,
        req.body.content,
        req.body.TicketNumber
    ],
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
});
//2.B) route to get a listing of all tickets:
router.get('/tickets/entries', async (req, res, next) => {
    db.query(
        "SELECT * FROM tickets",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
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

//2.D) route to Delete a Ticket given an ID alongside a valid JWT:
router.delete('/tickets/entries/:id', jwtVerify, async (req, res, next) => {
    db.query(`DELETE FROM tickets WHERE TicketID=${req.params.id}`, function (error, results) {
        if (error) throw error
        return res.status(200).send(results)
    })
});

//2.E) route to update a Ticket given an ID alongside a valid JWT:
router.patch("/tickets/entries/:id", jwtVerify, async (req, res, next) => {
    const {Username, content, Date,Completed, Notes, email, Ticket} = req.body
    db.query(`UPDATE tickets SET
    Username = "${Username}",
    content = "${content}",
    Date = "${Date}",
    email = "${email}",
    Completed = "${Completed}",
    Notes = "${Notes}",
    TicketNumber = "${TicketNumber}"
    WHERE
    TicketID = "${req.params.id}"`,
     function (error, results, fields) {
       if (error) throw error;
       return res.status(200).send(results);
   });
}); 


router.get('/ticketsearch', jwtVerify, async (req, res, next) => {
    db.query(
        `SELECT * FROM tickets WHERE TicketNumber LIKE "%`+req.query.key+`%" OR Username LIKE "%`+req.query.key+`%" OR email LIKE "%`+req.query.key+`%"`,
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});


export default router
