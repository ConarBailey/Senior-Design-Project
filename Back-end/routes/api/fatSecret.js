const express = require('express');
const router = express.Router();
const fatSecretController = require('../../controllers/fatSecretController');

router.post('/', fatSecretController.handleCallFatSecretAPI);

module.exports = router;