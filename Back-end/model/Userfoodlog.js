const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userfoodlogSchema = new Schema({
    username: {
        type: String,
        required: true
    },    
    logDate: {
        type: Date
    },
    mealName: {
        type: String,
        default: "Breakfast"
    },
    foodID: {
        type: Number,
        required: true
    },
    servingID: {
        type: Number,
        required: true
    },
    servingQuantity: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Userfoodlog',userfoodlogSchema);