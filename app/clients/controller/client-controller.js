const mongoose                       = require('mongoose');
const Client                         = require('../model/clients');
const csrf                           = require('csurf');
const async                          = require('async');
const csrfProtection                 = csrf();

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
		res.redirect('/clients/list');
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
		    res.redirect('/clients/list');
	});
};