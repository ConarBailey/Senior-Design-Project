const express = require('express');
const router = express.Router();
const fatSecretController = require('../../controllers/fatSecretController');

router.get('/', fatSecretController.handleCallFatSecretAPI);

module.exports = router;