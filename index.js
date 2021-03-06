import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import ticketRoutes from './src/ticketRoutes.js'
import userRoutes from './src/userRoutes.js'
import patientRoutes from './src/patientRoutes.js'
import patientRevisionRoutes from './src/patientRevisionRoutes.js'
import PatientNotesRoute from './src/PatientNotesRoute.js'
import PatientMedicalHistoryRoute from './src/PatientMedicalHistoryRoute.js'
import PatientScheduleRoute from './src/PatientScheduleRoute.js'
import cors from 'cors'

const port = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', ticketRoutes)
app.use('/', userRoutes)
app.use('/', patientRoutes)
app.use('/', patientRevisionRoutes)
app.use('/', PatientNotesRoute)
app.use('/', PatientMedicalHistoryRoute)
app.use('/', PatientScheduleRoute)

app.use((err, req, res, next) => {
    console.error(err.stack)
    return res.status(404).json({message: "not found"})
})

app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
