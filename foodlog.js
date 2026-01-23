const express = require('express');
const router = express.Router();
const foodlogController = require('../controllers/foodlogController');

router.post('/', foodlogController.handleNewFoodLog);

module.exports = router;