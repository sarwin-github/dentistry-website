const mongoose         = require('mongoose');
const AppointmentModel = require('../../appointments/model/appointments');
const Client           = require('../model/clients');
const Appointment      = mongoose.model('Appointments');
const csrf             = require('csurf');
const async            = require('async');
const csrfProtection   = csrf();

module.exports.getCreateClient = (req, res) => {
	res.render('clients/create-client.ejs', {
		csrfToken : req.csrfToken() //anti csurf token
	});
};

// http post for creating new client
module.exports.postCreateClient = (req, res) => {
	let client = new Client();

	client.email    = req.body.email;
	client.name     = req.body.name;
	client.age      = req.body.age;
	client.birthday = req.body.birthday;
	client.address  = req.body.address;
	client.phone    = req.body.phone;

	client.save((err) => {
		if(err){
		    return res.status(500).json({success: false, message: 'Something went wrong.'});
		}
		req.flash('message', 'Successfully added a new patient.');
		res.redirect('/patients/list');
	});
};

module.exports.listClients = (req, res) => {
	let query = Client.find({}).select({'__v': 0});

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

		res.render('clients/list-client.ejs',{
			success   : true, 
			message   : 'Successfully fetched the list of patients.',
			messages  : req.flash('message'),
			clients   : clients,
			csrfToken : req.csrfToken() //anti csurf token
		});
	});
}


// get the form for editing a client
module.exports.getEditClient = (req, res) => {
	let query = Client.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, client) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!client){
			return res.status(404).json({
				sucess  : false,
				message : 'The patient you are looking for does not exist.'
			});
		}

		res.render('clients/edit-client.ejs', {
			client    : client,
			csrfToken : req.csrfToken() //anti csurf token
		});
	});
};

// update a client
module.exports.putEditClient = (req, res) => {
	async.waterfall([
		// find client by id
	    (callback) => {
	      	let query = Client.findById({ _id: req.params.id }).select({'__v': 0});

  	      	query.exec((err, client) => {
  		        if(!client){
        			return res.status(404).json({
        				sucess  : false,
        				message : 'The patient you are looking for does not exist.'
        			});
        		}

  		        callback(err, client);
  	      	});
	    }, 
	    // update client
	    (client, callback) => {
	    	client.email    = req.body.email;
	    	client.name     = req.body.name;
	    	client.age      = req.body.age;
	    	client.birthday = req.body.birthday;
	    	client.address  = req.body.address;
	    	client.phone    = req.body.phone;

	    	client.save(err => {
	    		callback(err, client);
	    	});
	    }], (err) => {
		    if(err) {
		    	return res.status(500).json({ 
		    		sucess  : false, 
		    		error   : err, 
		    		message : 'Server error.'
		    	});
		    }
		    req.flash('message', 'Successfully updated patient details');
		    res.redirect('/patients/list');
	});
};

// delete a client
module.exports.deleteClient = (req, res) => {
	async.waterfall([
		//Check if the trainer already exist to list of registered trainers
	    (callback) => {
	      	let query = Client.findOneAndRemove({ _id: req.params.id })
	      				.select({'__v':0});

	      	query.exec((err, client) => {
	      		if(!client){
	      			return res.render('error/error.ejs', { 
	      				success: false, 
	      				error: "Error Deleting Patient", 
	      				message: "The patient you are looking for does not exist." 
	      			});
	      		}
	      		callback(err, client);
	      	});
	    }, (client, callback) => {
	    	async.parallel({
	    		// get client appointment
    		    appointment: (done) => {
    		    	let query = Appointment.findOneAndRemove({ 'bookedClients.bookedClient': client._id })

    		    	return query.exec((err, result) => {
    		    		return done(err, result);
    		    	});
    		    },
    		}, (err, data) => {
    		    if(err){
    		        return res.render('error/error.ejs', { success: false, error: err, message: "Something went wrong." });
    		    } if(!data){
    	            return res.render('error/error.ejs', { success: false, error: '404: Data not found.', 
    	                message: "The data you are looking for does not exist." });
    	        }

    		    callback(err, data);
    		});	
	    }], 
	    //Execute all callbacks
	    (err, results) => {
		    if(!!err) {
		    	return res.render('error/error.ejs', { success: false, error: err, message: "Something went wrong." });
		    }
		    
	    req.flash('message', 'The patient has been successfully removed.');
	    res.redirect("/patients/list"); 	 
	});
};