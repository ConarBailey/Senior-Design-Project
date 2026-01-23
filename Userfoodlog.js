const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userfoodlogSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },    
    calorieGoal: {
        type: String,
        default: 2000
    },        
    logDate: {
        type: Date
    },
    mealName: {
        type: String,
        default: "Breakfast"
    },
    foodName: {
        type: String,
        required: true
    },
    quantityValue: {
        type: Number,
        required: true
    },
    quantityUnits: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Userfoodlog',userfoodlogSchema);