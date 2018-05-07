const session    = require('express-session');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.initializeVariable = (req, res, next) => {
  	res.locals.session = req.session;
  	res.locals.title   = "Dentistry Office";
	res.locals.node_environment   = process.env.NODE_EN;

	next();
};