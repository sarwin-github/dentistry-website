const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const clientController = require('../controller/client-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

// create new patient
router.route('/create').get(clientController.getCreateClient)
					   .post(clientController.postCreateClient);

// list patient
router.route('/list').get(clientController.listClients);

//edit patient
router.route('/edit/:id').get(clientController.getEditClient)
					   .put(clientController.putEditClient);

//delete patient
router.route('/remove/:id').delete(clientController.deleteClient);

module.exports = router;