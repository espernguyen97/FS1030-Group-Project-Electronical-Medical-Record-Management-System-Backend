const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
	FirstName: {
		type: String,
        unique: true,
		required: true
	},
	LastName: {
		type: String,
		required: true
	},
	OHIP: {
		type: String,
		required: true
	},
	DOB: {
		type: String,
		required: true
	},
	lastEditBy: {
		type: String,
		required: true
	},
	notes: {
		type: String,
		required: false
	}
},{timestamps : true})


module.exports = mongoose.model('Patients', PatientSchema)
