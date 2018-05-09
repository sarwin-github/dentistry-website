const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const appointmentController = require('../controller/appointment-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

// appointment home
router.route('/').get(appointmentController.homeAppointment);

router.route('/create').get(appointmentController.getCreateAppointment)
				 .post(appointmentController.postCreateAppointment);

module.exports = router;