const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodIDSchema = new Schema({
    food_id:{
        type:Number,
        required:true
    },
    serving_id:{
        type: Number,
        required:true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

const mealSchema = new Schema({
    meal_type: {
        type: String,
        required: true
    },
    foodIDs: [foodIDSchema], //Array of foodIDs
});
const userfoodlogSchema = new Schema({
    username: {
        type: String,
        required: true
    },    
    calorieGoal: {
        type: Number,
        required: true
    },
    logDate: {
        type: Date,
        default: Date.now
    },
    meals: [mealSchema], // Array of meals
})

module.exports = mongoose.model('Userfoodlog',userfoodlogSchema);