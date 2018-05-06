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
