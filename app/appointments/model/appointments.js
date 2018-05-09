const mongoose 	= require('mongoose');
const Schema   	= mongoose.Schema;

const booking = mongoose.Schema({
	_id             : { id:false },
	bookedClient 	: { type: Schema.Types.ObjectId, ref: 'Client'},
	dateBooked      : { type: Date, default: Date.now },
	status			: String,
	dateActivated   : Date,
	expirationDate  : Date
});

const appointments = mongoose.Schema({
	title           : String,
	start           : String,
	end             : String,
	color           : String,
	description		: String,
	status 			: { type: String },
	dateCreated		: { type: Date, default: Date.now },
	bookedClients	: booking	
});

module.exports = mongoose.model('AppointmentBooking', booking);
module.exports = mongoose.model('Appointments', appointments);