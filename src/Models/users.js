const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
        unique: true,
		required: true
	},
	joindate: {
		type: Date,
		required: true
	},
	lastlogin: {
		type: Date,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
},{timestamps : true})


module.exports = mongoose.model('User', UserSchema)
