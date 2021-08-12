<br />
<p align="center">
  <a href="#">
  Link To live Site WIll go here</a>
  <h3 align="center">Rest API for React Website</h3>


### Installation
1. Create .env file with
  
* PORT=4000
* JWT_SECRET= put your own JWT secret here 
  

  Default Doctor is test@test.com
  Password: 12345678

  Default admin accounts are: 
  Steven@Steven.com
  Dave@Dave.com
  Chris@Chris.com
  Nhi@Nhi.com
  Mathivannan@Mathivannan.com

  With Password: 12345678

  
2. Intall the Dependancies
   ```sh
   npm install
   ```
   
2. Start the API App
   ```sh
   npm start
   ```


### MySQL Statements

| File Name | Line Number(s) | SQL Statement |
| --------- | --------------:| ------------- |
|PatientMedicalHistoryRoute,js|18|INSERT INTO medical_history(PatientID,Username,Date,Fever,Allergies,XrayURL,Covid_Checked,LabResults,BillStatus,Immunizations,Insurance_Provider,InsuredStatus,Smoker,Chronic_Pain,Past_Procedures,Weight,Prescriptions) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)|
|PatientMedicalHistoryRoute.js|46|SELECT * FROM medical_history ORDER BY Date DESC|
|PatientMedicalHistoryRoute.js|55|SELECT * FROM medical_history WHERE PatientID=${req.params.id}|
|PatientMedicalHistoryRoute.js|62|DELETE FROM medical_history WHERE PatientID=${req.params.id}|
|PatientMedicalHistoryRoute.js|71|UPDATE medical_history SET PatientID = "${PatientID}", Username = "${Username}", Date = "${Date}", Fever = "${Fever}", Allergies = "${Allergies}", XrayURL = "${XrayURL}", Covid_Checked = "${Covid_Checked}", BillStatus = "${BillStatus}", Immunizations = "${Immunizations}", Insurance_Provider = "${Insurance_Provider}", InsuredStatus = "${InsuredStatus}", Smoker = "${Smoker}", Chronic_Pain = "${Chronic_Pain}", Past_Procedures = "${Past_Procedures}", Weight = "${Weight}", LabResults = "${LabResults}", Prescriptions = "${Prescriptions}", WHERE Medical_H = "${req.params.id}"|
|PatientNotesRoute.js|18|INSERT INTO notes(PatientID,Username,Date,Note) VALUES ( ?,?,?,?)|
|PatientNotesRoute.js|33|SELECT * FROM notes ORDER BY Date DESC|
|PatientNotesRoute.js|42|SELECT * FROM notes WHERE PatientID=${req.params.id}|
|PatientNotesRoute.js|49|DELETE FROM notes WHERE noteID=${req.params.id}|
|PatientNotesRoute.js|58|UPDATE notes SET PatientID = "${PatientID}", Username = "${Username}", Date = "${Date}", Note = "${Note}", WHERE noteID = "${req.params.id}"|
|patientRevisionRoutes.js|23|INSERT INTO revision_history (UserID, PatientID, Revision) VALUES|
|patientRevisionRoutes.js|46|SELECT * FROM revision_history WHERE PatientID=${req.params.PatientID} ORDER BY Date DESC|
|patientRoutes.js|19|INSERT INTO patient(DOB,OHIP,First_Name,Last_Name,Address,City,Province,PostalCode,Phone_Number,Email,Age,Last_edit) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?)|
|patientRoutes.js|42|SELECT * FROM patient ORDER BY First_Name, Last_Name|
|patientRoutes.js|51|SELECT * FROM patient WHERE PatientID=${req.params.id}|
|patientRoutes.js|58|DELETE FROM patient WHERE PatientID=${req.params.id}|
|patientRoutes.js|66|UPDATE patient SET DOB = "${DOB}", OHIP = "${OHIP}", First_Name = "${First_Name}", Last_Name = "${Last_Name}", Address = "${Address}", City = "${City}", Province = "${Province}", PostalCode = "${PostalCode}", Phone_Number = "${Phone_Number}", Last_Edit = "${Last_Edit}", Email = "${Email}" WHERE PatientID = "${req.params.id}"|
|patientRoutes.js|88|SELECT * FROM patient WHERE First_Name LIKE "%`+req.query.key+`%" OR Last_Name LIKE "%`+req.query.key+`%" OR OHIP LIKE "%`+req.query.key+`%"|
|PatientScheduleRoute.js|18|INSERT INTO schedule(TimeSlot,Date,PatientID,Username) VALUES ( ?,?,?,?)|
|PatientScheduleRoute.js|33|SELECT * FROM schedule ORDER BY Date DESC|
|PatientScheduleRoute.js|42|SELECT * FROM schedule WHERE PatientID=${req.params.id} ORDER BY STR_TO_DATE( Date, '%Y-%m-%d' ) DESC, Timeslot DESC|
|PatientScheduleRoute.js|50|DELETE FROM schedule WHERE scheduleID=${req.params.id}|
|PatientScheduleRoute.js|59|UPDATE schedule SET TimeSlot = "${TimeSlot}", Date = "${Date}", PatientID = "${PatientID}", Username = "${Username}", WHERE noteID = "${req.params.id}"|
|PatientScheduleRoute.js|76|SELECT * FROM schedule WHERE Username LIKE "%`+req.query.key+`%" OR Date LIKE "%`+req.query.key+`%" OR Timeslot LIKE "%`+req.query.key+`%"|
|ticketRoutes.js|19|INSERT INTO tickets(Username,email,Date,content,TicketNumber) VALUES ( ?,?,?,?,?)|
|ticketRoutes.js|35|SELECT * FROM tickets|
|ticketRoutes.js|59|DELETE FROM tickets WHERE TicketID=${req.params.id}|
|ticketRoutes.js|68|UPDATE tickets SET Username = "${Username}", content = "${content}", Date = "${Date}", email = "${email}", Completed = "${Completed}", Notes = "${Notes}", TicketNumber = "${TicketNumber}" WHERE TicketID = "${req.params.id}"|
|ticketRoutes.js|87|SELECT * FROM tickets WHERE TicketNumber LIKE "%`+req.query.key+`%" OR Username LIKE "%`+req.query.key+`%" OR email LIKE "%`+req.query.key+`%"|
|userRoutes.js|22|SELECT Email FROM users WHERE Email = "${req.body.Email}"|
|userRoutes.js|27|SELECT Username FROM users WHERE Username = "${req.body.Username}"|
|userRoutes.js|40|INSERT INTO users (Username, Email, Password, First_Name, Last_Name, Job_Position, Admin_Flag, Last_Login) VALUES ("${Username}", "${Email}", "${Password}", "${First_Name}", "${Last_Name}", "${Job_Position}", ${Admin_Flag}, "${Last_Login}")|
|userRoutes.js|59|SELECT * FROM users WHERE Email = '${req.body.email}'|
|userRoutes.js|84|SELECT * FROM users ORDER BY First_Name, Last_Name|
|userRoutes.js|96|SELECT * FROM users WHERE UserID=${id}|
|userRoutes.js|113|DELETE FROM users WHERE UserID=${req.params.id}|
|userRoutes.js|121|SELECT * FROM users WHERE UserID = "${req.params.id}"|
|userRoutes.js|124|SELECT Email FROM users WHERE Email = "${req.body.Email}"|
|userRoutes.js|130|SELECT Username FROM users WHERE Username = "${req.body.Username}"|
|userRoutes.js|139|UPDATE users SET First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}" WHERE UserID = "${req.params.id}"|
|userRoutes.js|142|UPDATE users SET Username = "${Username}", First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}" WHERE UserID = "${req.params.id}"|
|userRoutes.js|145|UPDATE users SET First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}", Email = "${Email}" WHERE UserID = "${req.params.id}"|
|userRoutes.js|148|UPDATE users SET Username = "${Username}", First_Name = "${First_Name}", Last_Name = "${Last_Name}", Job_Position = "${Job_Position}", Admin_Flag = "${Admin_Flag}", Email = "${Email}" WHERE UserID = "${req.params.id}"|
|userRoutes.js|164|SELECT * FROM users WHERE Email='${email}'|
|userRoutes.js|183|SELECT * FROM users WHERE First_Name LIKE "%`+req.query.key+`%" OR Last_Name LIKE "%`+req.query.key+`%" OR Username LIKE "%`+req.query.key+`%"|
   
