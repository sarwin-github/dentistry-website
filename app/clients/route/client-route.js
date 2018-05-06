const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const clientController = require('../controller/client-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

// create new client
router.route('/create').get(clientController.getCreateClient)

module.exports = router;