const express = require('express');
const router  = express();

const contactUsController = require('../controller/contact-us-controller');

/* Get The home page with list of fitness option */
router.route('/').get(contactUsController.getContactUs);

module.exports = router;
