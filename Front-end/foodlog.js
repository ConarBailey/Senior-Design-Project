const express = require('express');
const router = express.Router();
const foodlogController = require('../controllers/foodlogController');

router.route('/')
    .get(foodlogController.getUsersLog)
    .post(foodlogController.handleNewFoodLog)
    .put(foodlogController.updateFoodLog)
    .delete(foodlogController.deleteFoodLog);

router.route('/:username')
    .get(foodlogController.getUserLog);

module.exports = router;