const express = require('express');
const router  = express();

const servicesController = require('../controller/services-controller');

/* Get The home page with list of fitness option */
router.route('/').get(servicesController.getServices);

module.exports = router;
