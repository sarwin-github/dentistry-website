const mongoose                       = require('mongoose');
const Client                         = require('../../clients/model/clients');
const csrf                           = require('csurf');
const async                          = require('async');
const csrfProtection                 = csrf();

module.exports.homeAppointment = (req, res) => {
	res.render('appointments/appointments.ejs');
};
