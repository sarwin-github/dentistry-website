const mongoose       = require('mongoose');
const Client         = require('../../clients/model/clients');
const AppointmentModel  = require('../model/appointments');
const Appointment    = mongoose.model('Appointments');
const Booking        = mongoose.model('AppointmentBooking');
const csrf           = require('csurf');
const async          = require('async');
const csrfProtection = csrf();

// appointments home
module.exports.homeAppointment = (req, res) => {
	let query = Appointment.find({'status': 'Active'}).select({'__v': 0})
				.populate('bookedClients.bookedClient').sort('start');

	query.exec((err, appointments) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!appointments){
			return res.status(404).json({
				sucess  : false,
				message : 'A list of appointments does not exist.'
			});
		}

		res.render('appointments/appointments.ejs', { appointments: appointments });
	});	
};

// get form for creating new appointment
module.exports.getCreateAppointment = (req, res) => {
	let query = Client.find({}).select({'__v': 0}).sort('name');

	query.exec((err, clients) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!clients){
			return res.status(404).json({
				sucess  : false,
				message : 'A list of patients does not exist.'
			});
		}

		res.render('appointments/dentist-create-appointment.ejs', {
			clients   : clients,
			csrfToken : req.csrfToken() //anti csurf token
		});
	});	
};

// create new appointment
module.exports.postCreateAppointment = (req, res) => {
	async.waterfall([
		(callback) => {
			let letters = '0123456789'.split('');
		    let color = '#';
		    for (let i = 0; i < 6; i++) {
		        color += letters[Math.floor(Math.random() * 10)];
		    }
		    callback(null, color);
		// Update the center after validating
		}, (color, callback) => {
	      	req.checkBody('title', 'Title is required.').notEmpty();
  			req.checkBody('description', 'Description is required.').notEmpty();
  			
  			// Validate Error
  			let errors = req.validationErrors();
  			if (errors){
  			    let messages = [];
  			    errors.forEach((error) => {
  			       messages.push(error.msg);
  			    });

  			    req.flash('error', messages);
  			    res.redirect(req.get('referer'));
  			} else {
	    		let appointment = new Appointment();
	    		let booking     = new Booking();

    			booking.bookedClient    = req.body.patient;
  
    			appointment.title       = req.body.title;
    			appointment.start       = req.body.start;
    			appointment.end         = req.body.end;
    			appointment.color       = color;
    			appointment.description = req.body.description;
    			appointment.status      = 'Active',
    			appointment.bookedClients = booking;

    			appointment.save(err => {
    				callback(err);
    			});	
  			}
	    }], (err) => {
	    	if(err) {
	    		return res.render('error/error.ejs', { success: false, error: err, message: "Something went wrong." });
	    	}
		req.flash('message', 'Appointment has been successfully created.');
		res.redirect('/appointments');
	});
};