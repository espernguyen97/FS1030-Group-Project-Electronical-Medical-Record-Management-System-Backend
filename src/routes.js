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

//setup Data paths
const TicketPostDataPath = path.resolve(process.env.TICKET_DATA_PATH);
//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

/*TODO: As this file gets bigger we can split it into separate js files for each
section of routes (ex: usersRoutes.js, patientsRoutes.js, etc.) SW*/


//2. Routes for tickets
//>>>2.A) route to create a new ticket:
router.post('/tickets/entries', async (req, res, next) => {
    db.query("INSERT INTO tickets(Username,email,Date,content) VALUES ( ?,?,?,?)",
    [req.body.Username,req.body.email,req.body.Date,req.body.content],
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

//4. TODO define routes for patient notes (create, read)

//5. TODO define routes for patient records (create, read)

//6. TODO define routes for patient revision history (create, read)

export default router
