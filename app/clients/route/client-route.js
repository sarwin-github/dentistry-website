const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const clientController = require('../controller/client-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

// create new client
router.route('/create').get(clientController.getCreateClient)
					   .post(clientController.postCreateClient);

// list clients
router.route('/list').get(clientController.listClients);

//edit
router.route('/edit/:id').get(clientController.getEditClient)
					   .put(clientController.putEditClient)

module.exports = router;