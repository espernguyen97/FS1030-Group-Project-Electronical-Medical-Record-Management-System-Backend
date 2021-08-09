//Dependency imports:
import express from 'express' ;
import jwt from 'jsonwebtoken' ;
import dotenv from 'dotenv' ;
dotenv.config();

//Custom module imports:
import jwtVerify from './middleware/jwtVerify.js' ;
import { verifyHash, createHash } from './util/hasher.js' ;
import { validateUser, validateUserEdit } from './middleware/validation.js' ;

//Database Connection path
const db = require("./DataBase/DBconnectionPath");

const router = express.Router() ;

//1. Routes for users
//>>>1.A) route to create a new user:
/*(note: an admin should be logged in to create a new care provider, hence the use of jwtVerify.
Otherwise anyone could create a new account.)*/
router.post('/users', jwtVerify, validateUser, (req, res, next) => {
    db.query(`SELECT Email FROM users WHERE Email = "${req.body.Email}"`,
        function (error, results, fields){
            if (results.length){
                return res.status(400).json('Error: an account with this email address already exists.');
            };
            let password = req.body.Password; 
            createHash(password).then(hash => {
                req.body.Password = hash;
                return req.body;            
            }).then(async (newUser) => {
                const {Username, Email, Password, First_Name, Last_Name, Job_Position, Admin_Flag, Last_Login} = newUser;
                try {
                    db.query(
                        `INSERT INTO users (Username, Email, Password, First_Name, Last_Name, Job_Position, Admin_Flag, Last_Login) 
                        VALUES ("${Username}", "${Email}", "${Password}", "${First_Name}", "${Last_Name}", "${Job_Position}", ${Admin_Flag}, "${Last_Login}")`,
                        function (error, results, fields){
                            if (error) throw error;
                            delete newUser.password;
                            return res.status(201).json(newUser);
                        }
                    );
                } catch (err) {
                    console.error(err);
                    return next(err);
                };
            });    
        }
    );
});
//>>>1.B) route to log in a registered user to create a JWT:
router.post('/auth', async (req, res) => {
    db.query(
        `SELECT * FROM users WHERE Email = '${req.body.email}'`,
        function (error, results, fields) {
            if (error) throw error;
            const user = results[0];
            //In the event the email or password does not match: 
            if (!user) {
                return res.status(401).json({message: "incorrect credentials provided"});
            };  
            let password = req.body.password;
            let storedHash = user.Password;
            verifyHash(password, storedHash).then(valid => {
                if (!valid) {
                    return res.status(401).json({message: "incorrect credentials provided"});
                };
                //Upon successful login: 
                const userEmail = req.body.email;
                const token = jwt.sign({userEmail}, process.env.JWT_SECRET, {expiresIn: "2h"});      
                return res.json({token});
            });
        }
    );
});
//>>>1.C) route to get a listing of all users when a valid JWT is provided:
router.get('/users', jwtVerify, async (req, res, next) => {
    db.query(
        "SELECT * FROM users ORDER BY First_Name, Last_Name",
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
  });
// >>>1.D) route to get a specific user when given an ID alongside a valid JWT:
router.get('/user/:id', jwtVerify, async (req, res, next) => {
    const {id} = req.params;
    try {
        db.query(
            `SELECT * FROM users WHERE UserID=${id}`,
            function (error, results, fields){
                if (error) throw error;
                const user = results[0];
                if (!user) {
                    return res.status(404).json({message: `user not found`});
                };
                return res.json(user);
            }
        );       
    } catch (err) {
        console.error(err);
        return next(err);
    };
});
//1.E) route to delete a specific user when given an ID alongside a valid JWT:
router.delete('/users/:id', jwtVerify, async (req, res, next) => {
    db.query(`DELETE FROM users WHERE UserID=${req.params.id}`, function (error, results) {
        if (error) throw error
        return res.status(200).send(results)
    })
});
//1.F) route to update a specific user when given an ID along side a valid JWT:
router.patch("/users/:id", jwtVerify, validateUserEdit, async (req, res, next) => {
    //Note: in users table in database the Email and Username fields must be unique
    db.query(`SELECT * FROM users WHERE UserID = "${req.params.id}"`, //get the previous data for this user
        function (error, results, fields){
            const prevData = results[0];
            db.query(`SELECT Email FROM users WHERE Email = "${req.body.Email}"`, //check if new email is already in use by another user
            function (error, results, fields){          
                if (results.length && prevData.Email !== req.body.Email){ 
                    return res.status(400).json('Error: an account with this email address already exists.');
                }
                let sameEmail = prevData.Email === req.body.Email;
                db.query(`SELECT Username FROM users WHERE Username = "${req.body.Username}"`, //check if new username is already in use by another user
                    function (error, results, fields){          
                        if (results.length && prevData.Username !== req.body.Username){
                            return res.status(400).json('Error: an account with this username already exists.');
                        }
                        let sameUsername = prevData.Username === req.body.Username;
                        const {Username, First_Name, Last_Name, Job_Position, Admin_Flag, Email} = req.body
                        let nextQuery;
                        if (sameEmail && sameUsername){ //Case 1: email and username remain unchanged
                            nextQuery = `UPDATE users SET First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}" WHERE UserID = "${req.params.id}"`;
                        }
                        if (sameEmail && !sameUsername){ //Case 2: username is changed while email remains unchanged
                            nextQuery = `UPDATE users SET Username = "${Username}", First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}" WHERE UserID = "${req.params.id}"`;
                        }
                        if (!sameEmail && sameUsername){ //Case 3: email is changed while username remains unchanged
                            nextQuery = `UPDATE users SET First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}", Email = "${Email}" WHERE UserID = "${req.params.id}"`;
                        }
                        if (!sameEmail && !sameUsername){ //Case 4: both email and username are changed
                            nextQuery = `UPDATE users SET Username = "${Username}", First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}", Email = "${Email}" WHERE UserID = "${req.params.id}"`;
                        }
                        db.query(nextQuery, function (error, results, fields) {
                            if (error) throw error;
                            return res.status(200).send(results);
                        });
                    });
            });       
    });      
}); 

//>>>1.G) route to get a specific user by their email:
router.get('/users/:email', jwtVerify, async (req, res, next) => {
    const {email} = req.params;
    try {
        db.query(
            `SELECT * FROM users WHERE Email='${email}'`,
            function (error, results, fields){
                if (error) throw error;
                const user = results[0];
                if (!user) {
                    return res.status(404).json({message: `user not found`});
                };
                return res.json(user);
            }
        );       
    } catch (err) {
        console.error(err);
        return next(err);
    };
});


router.get('/usersearch', jwtVerify, async (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE First_Name LIKE "%`+req.query.key+`%" OR Last_Name LIKE "%`+req.query.key+`%" OR Username LIKE "%`+req.query.key+`%"`,
        function (error, results, fields) {
          if (error) throw error;
          return res.status(200).send(results);
        }
      );
});

export default router