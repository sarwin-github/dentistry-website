//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get Routes Source
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const HomeRoutes   = require('../app/home/route/home-route');
const ClientRoutes = require('../app/clients/route/client-route');
const AppointmentRoutes   = require('../app/appointments/route/appointment-route');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.initializeRoutes = app => {
	/* Home routes */
	app.use('/', HomeRoutes);
	app.use('/clients', ClientRoutes);
	app.use('/appointments', AppointmentRoutes);
};
